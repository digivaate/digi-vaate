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

    clearOtherRelations(req, res, next) {
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

export default new ProductController();