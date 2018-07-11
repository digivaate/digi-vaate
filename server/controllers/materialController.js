import Models from '../models/models';
import Controller from './Controller';
import fs from 'fs';

class MaterialController extends Controller {
    constructor() { super(Models.Material); }
    setRelations(entity, jsonBody){
        if (jsonBody.products) entity.setProducts(jsonBody.products);
        if (jsonBody.collections) entity.setCollections(jsonBody.collections);
    }

    uploadImage(req, res, next) {
        Models.Material.findById(req.params.id)
            .then(ent => {
                if (fs.existsSync('./uploads/' + ent.imagePath)) {
                    fs.unlinkSync('./uploads/' + ent.imagePath);
                }
                ent.set('imagePath', req.file.filename);
                return ent.save();
            })
            .then(ent => res.send(ent) )
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            })
    }

    deleteImage(req,res,next) {
        Models.Material.findById(req.params.id)
            .then(ent => {
                if (fs.existsSync('./uploads/' + ent.imagePath)) {
                    fs.unlinkSync('./uploads/' + ent.imagePath);
                }
                ent.set('imagePath', null);
                return ent.save();
            })
            .then(ent => {
                res.send(ent);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            })
    }
}

export default new MaterialController();