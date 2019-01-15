const Controller = require('./Controller');
const fs = require('fs');

class MaterialController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.materials) }

    setRelations = (entity, jsonBody) => {
        const promises = [];
        if (jsonBody.products) promises.push( entity.setProducts(jsonBody.products) );
        if (jsonBody.collections) promises.push( entity.setCollections(jsonBody.collections) );
        return Promise.all(promises);
    };

    uploadImage = (req, res, next) => {
        console.log('MATIMG', req);
       this.dbConnection.models.images.create(req.file)
            .then(img => {
                this.model.findById(req.query.id)
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
        this.dbConnection.models.products.findById(req.query.id, {
            attributes: ['imageId']
        })
            .then(ent => {
                if (!ent) {
                    res.status(404).json({ error: 'No material found with id: ' + req.query.id });
                }
                if (!ent.imageId) {
                    res.status(404).json({ error: 'No image found' });
                }
                return this.dbConnection.models.images.findById(ent.imageId);
            })
            .then(image => {
                res.contentType(image.mimetype);
                res.end(image.buffer);
            })
            .catch(err => res.status(500).json({ error: err }));
    };

}

module.exports = MaterialController;