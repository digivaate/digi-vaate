module.exports = class Controller {
    constructor(dbConnection, model) {
        this.model = model;
        this.dbConnection = dbConnection;
        this.find_by_attribute = this.find_by_attribute.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.create = this.create.bind(this);
        Controller.collectProperties = Controller.collectProperties.bind(this);
    }

    find_by_attribute = (req, res) => {
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
    };

    create(req, res) {
        let entity = null;
        this.model.create(req.body)
            .then(ent => {
                entity = ent;
                return this.setRelations(ent, req.body);
            })
            .then(() => {
                res.send(entity);
            })
            .catch(this.dbConnection.Sequelize.ValidationError, (err) => {
                // respond with validation errors
                console.error(err);
                return res.status(422).send(err.errors);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    };

    update(req, res) {
        const properties = Controller.collectProperties(req.query, this.model);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        const updatedEntities = [];
        this.model.findAll({ where: properties })
            .then(ents => {
                const promises = [];
                ents.forEach( ent => {
                    promises.push(this.setRelations(ent, req.body));
                    updatedEntities.push(ent.updateAttributes(req.body));
                });
                return Promise.all(promises.concat(updatedEntities));
            })
            .then(() => {
                return Promise.all(updatedEntities);
            })
            .then(ents => {
                res.send(ents);
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
                return Promise.all(deletedEnts);
            })
            .then(() => res.send('deleted'))
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
};
