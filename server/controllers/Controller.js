
export default class Controller {
    constructor(model) {
        this.model = model;
        this.find_by_attribute = this.find_by_attribute.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.create = this.create.bind(this);
        Controller.collectProperties = Controller.collectProperties.bind(this);
    }

    find_by_attribute(req, res) {
        const properties = Controller.collectProperties(req.query, this.model);
        if (properties.error) {
            res.stat(500).json(properties.error);
            return;
        }
        this.model.findAll({
            where: properties,
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
            .then(ent => {
                return this.setRelations(ent, req.body);
            })
            .then(ent => {
                res.send(ent);
            })
            .catch(err => {
                console.error('Error: ' + err);
                res.status(500).json({ error: err });
            });
    };

    update(req, res) {
        const properties = Controller.collectProperties(req.query, this.model);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        this.model.findAll({ where: properties })
            .then(ents => {
                const updatedEnts = [];
                ents.forEach(ent => {
                    this.setRelations(ent, req.body);
                    updatedEnts.push(ent.updateAttributes(req.body));
                });
                Promise.all(updatedEnts)
                    .then(resolved => {
                        res.send(resolved);
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    };

    delete(req, res) {
        const properties = Controller.collectProperties(req.query, this.model);
        if (properties.error) {
            res.stat(500).json(properties);
            return;
        }
        this.model.findAll({ where: properties })
            .then(ents => {
                const deletedEnts = [];
                ents.forEach(ent => {
                    deletedEnts.push(ent.destroy());
                });
                Promise.all(deletedEnts)
                    .then( res.send({status: 'deleted'}) );
            })
            .catch(err => {
                console.error('Error: ' + err);
                res.status(500).json({ error: err });
            });
    };

    static collectProperties(query, model) {
        const properties = {};
        for (let attr in query) {
            if (attr in model.rawAttributes) {
                if (query.hasOwnProperty(attr)) {
                    properties[attr] = query[attr];
                }
            } else {
                return {error: 'No attribute ' + attr + ' found'}
            }
        }
        return properties;
    }

    setRelations(entity, jsonBody) {
        //is used if there is relations set in the model
    }
}
