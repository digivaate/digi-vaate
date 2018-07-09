import Models from '../models/models';
import Controller from './Controller';
import multer from '../multer';

class ProductController extends Controller {
    constructor() { super(Models.Product); }
    setRelations(entity, jsonBody){
        if (jsonBody.colors) { entity.setColors(jsonBody.colors); }
        if (jsonBody.materials) { entity.setMaterials(jsonBody.materials); }
    }

    //saves the file path to entity that is saved to the server in the previous function
    uploadImage(req, res, next) {
        console.log(req.query);
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
}

export default new ProductController();