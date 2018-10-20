const Models = require('../models/models');
const Controller = require('./Controller');
const fs = require('fs');

class ProductController extends Controller {
    constructor() { super(Models.Product); }

    static clearOtherRelations(req, res, next) {
        if (req.body.companyId) {
            req.body.seasonId = null;
            req.body.collectionId = null;
        } else if (req.body.seasonId) {
            req.body.companyId = null;
            req.body.collectionId = null;
        } else if (req.body.collectionId) {
            req.body.seasonId = null;
            req.body.companyId = null;
        }
        next();
    }

    static calcMaterialCosts(product) {
        let materialCosts = 0;
        product.dataValues.materials.forEach(material => {
            materialCosts += material.unitPrice * material.material_product.consumption + material.freight;
        });
        return parseFloat(materialCosts.toFixed(2));
    }

    static calcPurchasingPrice(product) {
        const materialCosts = ProductController.calcMaterialCosts(product);
        return product.subcCostTotal + materialCosts;
    }

    async setRelations(entity, jsonBody) {
        const promises = [];
        if (jsonBody.colors) promises.push(entity.setColors(jsonBody.colors));
        if (jsonBody.sizes) promises.push(entity.setSizes(jsonBody.sizes));
        if (jsonBody.materials) {
            await entity.setMaterials([]);
            jsonBody.materials.forEach(mat => {
                promises.push(
                    entity.addMaterial(mat.id, {through: {consumption: mat.consumption}})
                )
            });
        }
        return Promise.all(promises);
    }

    find_by_attribute(req, res) {
        const properties = Controller.collectProperties(req.query, this.model);
        if (properties.error) {
            res.stat(500).json(properties.error);
            return;
        }
        this.model.findAll({
            where: properties,
            include: [{ all: true }]
        })
            .then(ents => {
                ents.forEach(ent => ent.dataValues.materialCosts = ProductController.calcMaterialCosts(ent));
                res.send(ents);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    }

    create(req, res) {
        let entity = null;
        this.model.create(req.body)
            .then(async ent => {
                entity = ent;
                await this.setRelations(ent, req.body);
                entity = await this.model.findById(entity.id, {
                    include: [{ all: true }]
                });
                res.send(entity);
            })
            .catch(err => {
                console.error('Error: ' + err);
                res.status(500).json({ error: err });
            });
    };

    update(req, res) {
        const properties = Controller.collectProperties(req.query, this.model);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        const updatedEntities = [];
        this.model.findAll({ where: properties })
            .then(ents => {
                const promises = [];
                ents.forEach( ent => {
                    promises.push(this.setRelations(ent, req.body));
                    updatedEntities.push(ent.updateAttributes(req.body));
                });
                return Promise.all(promises.concat(updatedEntities));
            })
            .then(async () => {
                const ents = await this.model.findAll({
                    where: properties,
                    include: [{all: true}]
                });
                res.send(ents);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    };

    uploadImage(req, res, next) {
        Models.Image.create(req.file)
            .then(img => {
                Models.Product.findById(req.query.id)
                    .then(ent => {
                        if (ent.imageId) {
                            Models.Image.destroy({
                                where: { id: ent.imageId }
                            });
                        }
                        ent.set('imageId', img.id);
                        return ent.save();
                    })
                    .then(ent => res.send(ent) )
                    .catch(err => {
                        console.error(err);
                        res.status(500).json(err);
                    })
            });
    }

    getImage(req, res, next) {
        Models.Product.findById(req.query.id, {
            attributes: ['imageId']
        })
            .then(ent => {
                if (!ent) {
                    res.status(404).json({ error: 'No product found with id: ' + req.query.id });
                }
                if (!ent.imageId) {
                    res.status(404).json({ error: 'No image found' });
                }
                return Models.Image.findById(ent.imageId);
            })
            .then(image => {
                res.contentType(image.mimetype);
                res.end(image.buffer);
            })
            .catch(err => res.status(500).json({ error: err }));
    }

}

module.exports = ProductController;