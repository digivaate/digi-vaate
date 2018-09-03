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
        return materialCosts;
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

    //saves the file path to entity that is saved to the server in the previous function
    uploadImage(req, res, next) {
        const properties = Controller.collectProperties(req.query, Models.Product);
        if (properties.error) {
            res.stat(500).json(properties.error);
            return;
        }
        //save the file path for entity
        Models.Product.findAll({
            where: properties,
            include: [{ all: true }]
        })
            .then(async ents => {
                const updatedEnts = [];
                ents.forEach(ent => {
                    updatedEnts.push(
                        ent.updateAttributes({imagePath: req.file.filename})
                    );
                });
                await Promise.all(updatedEnts);
                res.send(ents);
            })
            .catch(err => next(err));
    }

    deleteImage(req, res, next) {
        const properties = Controller.collectProperties(req.query, Models.Product);
        if (properties.error) {
            res.stat(500).json(properties.error);
            return;
        }
        Models.Product.findAll({ where: properties })
            .then(ents => {
                //delete file if exist
                if (fs.existsSync('./uploads/' + ents[0].imagePath)) {
                    fs.unlinkSync('./uploads/' + ents[0].imagePath);
                }
                const updatedEnts = [];
                //remove file path from all the products
                ents.forEach(ent => {
                    ent.imagePath = null;
                    updatedEnts.push( ent.save() );
                });
                Promise.all(updatedEnts)
                    .then(resolved => {
                        next();
                    });
            });
    }
}

module.exports = ProductController;