const Models = require('../models/models');
const Controller = require('./Controller');
const fs = require('fs');

class MaterialController extends Controller {
    constructor() { super(Models.Material); }
    setRelations(entity, jsonBody){
        const promises = [];
        if (jsonBody.products) promises.push( entity.setProducts(jsonBody.products) );
        if (jsonBody.collections) promises.push( entity.setCollections(jsonBody.collections) );
        return Promise.all(promises);
    }

    uploadImage(req, res, next) {
        Models.Image.create(req.file)
            .then(img => {
                Models.Material.findById(req.query.id)
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
        Models.Material.findById(req.query.id, {
            attributes: ['imageId']
        })
            .then(ent => {
                if (!ent) {
                    res.send(404).json({ error: 'No material found with id: ' + req.query.id });
                }
                if (!ent.imageId) {
                    res.send(404).json({ error: 'No image found' });
                }
                return Models.Image.findById(ent.imageId);
            })
            .then(image => {
                res.contentType(image.mimetype);
                res.end(image.buffer);
            })
    }
}

module.exports = new MaterialController();