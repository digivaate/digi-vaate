
export default class Controller {
    constructor(model) {
        this.model = model;
        console.log(this.model);
        this.find_by_attribute = this.find_by_attribute.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.create = this.create.bind(this);
    }

    find_by_attribute(req, res) {
        const params = {};
        console.log(this.model);
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
                res.stat(500).json(err);
            });
    }

    /*
    find_all = (req, res) => {
        this.model.findAll({ include: [{ all: true }] })
            .then(doc => {
                res.send(doc);
            })
            .catch(err => {
                console.error('Error: ' + err);
                res.send({ error: err })
            });
    };
    */
    /*
    find_by_id = (req, res) => {
        this.model.findById(req.params.id, { include: [{ all: true }] })
            .then(doc => {
                res.send(doc);
            })
            .catch(err => {
                console.error('Error: ' + err);
                res.status(500).json({ error: err });
            });
    };
*/
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
        this.model.findById(req.params.id)
            .then(ent => {
                ent.updateAttributes(req.body);
                res.send(ent);
            })
            .catch(err => {
                console.error('Error: ' + err);
                res.status(500).json({ error: err });
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

}
