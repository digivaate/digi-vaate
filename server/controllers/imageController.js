const Models = require('../models/models');
const Controller = require('./Controller');
const fs = require('fs');

class ImageController extends Controller {
    constructor() { super(Models.Image); }

    getImage(req, res, next) {
        if (!req.query.id) throw 'No image id given';

        Models.Image.findById(req.query.id)
            .then(image => {
                if (!image) throw `No image found with id: ${req.query.id}`;

                res.contentType(image.mimetype);
                res.end(image.buffer);
            })
            .catch(err => res.status(500).json({ error: err }));
    }
}

module.exports = new ImageController();

