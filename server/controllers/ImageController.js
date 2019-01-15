const Controller = require('./Controller');

class ImageController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.images) }

    getImage = (req, res, next) => {
        if (!req.query.id) throw 'No image id given';
        this.model.findById(req.query.id)
            .then(image => {
                if (!image) throw `No image found with id: ${req.query.id}`;

                res.contentType(image.mimetype);
                res.end(image.buffer);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err })
            });
    }
}

module.exports = ImageController;

