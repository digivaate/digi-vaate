const Controller = require("./Controller");
const Models = require("../models/models");

class SizeController extends Controller {
    constructor() { super(Models.Size); }

    create(req, res, next) {
        if (Array.isArray(req.body)) {
            const promeses = [];
            req.body.forEach(ent => {
                promeses.push( Models.Size.create(ent) );
            });
            Promise.all(promeses)
                .then(resolved => {
                    res.send(resolved);
                })
                .catch(err => next(err) );
        } else {
            let entity = null;
            this.model.create(req.body)
                .then(ent => {
                    entity = ent;
                    return this.setRelations(ent, req.body);
                })
                .then(() => {
                    res.send(entity);
                })
                .catch(err => {
                    console.error('Error: ' + err);
                    res.status(500).json({error: err});
                });
        }
    };
}

module.exports = SizeController;