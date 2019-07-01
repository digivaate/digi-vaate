const Controller = require("./Controller");

class SizeController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.sizes) }

    create = (req, res, next) => {
        if (Array.isArray(req.body)) {
            const promises = [];
            req.body.forEach(ent => {
                ent.ownerCompany = req.compAuth.companyId;
                promises.push( this.model.create(ent) );
            });
            Promise.all(promises)
                .then(resolved => {
                    res.send(resolved);
                })
                .catch(err => {
                    console.error(err);
                    next(err);
                });
        } else {
            let entity = null;
            req.body.ownerCompany = req.compAuth.companyId;
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