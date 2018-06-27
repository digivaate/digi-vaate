
export default class Controller {
    constructor(model) {
        this.model = model;
        this.find_by_attribute = this.find_by_attribute.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.create = this.create.bind(this);
    }

    find_by_attribute(req, res) {
        const params = {};
        for(let attr in req.query) {
            if (attr in this.model.rawAttributes && req.query.hasOwnProperty(attr)) {
                params[attr] = req.query[attr];
            } else {
                res.status(500).json({
                    error: 'No attribute ' + attr + ' found'
                });
                return;
            }
        }
        this.model.findAll({
            where: params,
            include: [{ all: true }]
        })
            .then(ent => {
                res.send(ent);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    }

    create(req, res) {
        this.model.create(req.body)
            .then(doc => {
                res.send(doc);
            })
            .catch(err => {
                console.error('Error: ' + err);
                res.status(500).json({ error: err });
            });
    };

    update(req, res) {
        const params = {};
        for (let attr in req.query) {
            if (attr in this.model.rawAttributes && req.query.hasOwnProperty(attr)) {
                params[attr] = req.query[attr];
            } else {
                res.status(500).json({
                    error: 'No attribute ' + attr + ' found'
                });
                return;
            }
        }
        this.model.findAll({ where: params })
            .then(ent => {
                const updatedEnts = [];
                ent.forEach(ent => {
                    this.setRelations(ent, req.body);
                    updatedEnts.push(ent.updateAttributes(req.body));
                });
                Promise.all(updatedEnts)
                    .then(updated => {
                        res.send(updated);
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    };

    delete(req, res) {
        this.model.findById(req.params.id)
            .then(ent => {
                if (ent) {
                    ent.destroy();
                    res.send({status: 'deleted'});
                } else {
                    res.status(500).json({
                        error: 'Not existing or already deleted'
                    });
                }
            })
            .catch(err => {
                console.error('Error: ' + err);
                res.status(500).json({ error: err });
            });
    };

    setRelations(entity, jsonBody) {

    }
}
