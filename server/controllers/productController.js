import Models from '../models/models';
import Controller from './Controller';
import fs from 'fs';

class ProductController extends Controller {
    constructor() { super(Models.Product); }
    setRelations(entity, jsonBody){
        const promises = [];
        if (jsonBody.colors) promises.push( entity.setColors(jsonBody.colors) );
        if (jsonBody.materials) promises.push( entity.setMaterials(jsonBody.materials) );
        return Promise.all(promises);
    }

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

    static addMaterialCosts(product) {
        let materialCosts = 0;
        product.dataValues.materials.forEach(material => {
            materialCosts += material.unitPrice * material.consumption + material.freight;
        });
        product.dataValues.materialCosts = materialCosts;
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
                console.log(ents);
                ents.forEach(ent => ProductController.addMaterialCosts(ent));
                res.send(ents);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    }

    //saves the file path to entity that is saved to the server in the previous function
    uploadImage(req, res, next) {
        const properties = Controller.collectProperties(req.query, Models.Product);
        if (properties.error) {
            res.stat(500).json(properties.error);
            return;
        }
        //save the file path for entity
        Models.Product.findAll({ where: properties })
            .then(ents => {
                const updatedEnts = [];
                ents.forEach(ent => {
                    updatedEnts.push(
                        ent.updateAttributes( { imagePath: req.file.filename})
                    );
                });
                Promise.all(updatedEnts)
                    .then(resolved => {
                        res.send(resolved);
                    });
            });
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

export default ProductController;