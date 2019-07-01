const Controller = require('./Controller');

class ProductController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.products); }

    static clearOtherRelations = (req, res, next) => {
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
    };

    static calcMaterialCosts = (product) => {
        let materialCosts = 0;
        product.dataValues.materials.forEach(material => {
            materialCosts += material.unitPrice * material.material_product.consumption + material.freight;
        });
        return parseFloat(materialCosts.toFixed(2));
    };

    static calcPurchasingPrice = (product) => {
        const materialCosts = ProductController.calcMaterialCosts(product);
        return product.subcCostTotal + materialCosts;
    };

    setRelations = async (entity, jsonBody) => {
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
    };

    find_by_attribute = (req, res) => {
        const properties = Controller.collectProperties(req.query, this.model, req.compAuth.companyId);
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
    };

    create = (req, res) => {
        let entity = null;
        req.body.ownerCompany = req.compAuth.companyId;
        
        this.model.create(req.body)
            .then(async ent => {
                entity = ent;
                await this.setRelations(ent, req.body);
                entity = await this.model.findByPk(entity.id, {
                    include: [{ all: true }]
                });
                res.send(entity);
            })
            .catch(this.dbConnection.sequelize.ValidationError, (err) => {
                // respond with validation errors
                console.error(err);
                return res.status(422).send({errors: err.errors });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    };

    update = (req, res) => {
        const properties = Controller.collectProperties(req.query, this.model, req.compAuth.companyId);
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

    uploadImage = (req, res, next) => {
        this.dbConnection.models.images.create(req.file)
            .then(img => {
                console.log('IMG', img);
                this.model.findByPk(req.query.id)
                    .then(ent => {
                        if (ent.imageId) {
                            this.dbConnection.models.images.destroy({
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
    };

    getImage = (req, res, next) => {
        this.model.findByPk(req.query.id, {
            attributes: ['imageId']
        })
            .then(ent => {
                if (!ent) {
                    res.status(404).json({ error: 'No product found with id: ' + req.query.id });
                }
                if (!ent.imageId) {
                    res.status(404).json({ error: 'No image found' });
                }
                return this.dbConnection.models.images.findByPk(ent.imageId);
            })
            .then(image => {
                res.contentType(image.mimetype);
                res.end(image.buffer);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err })
            });
    };

}

module.exports = ProductController;
