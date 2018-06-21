import models from '../models/models';

exports.find_all = (req, res) => {
    models.Season.findAll()
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.send({ error: err })
        });
};

exports.find_by_id = (req, res) => {
    models.Season.findById(req.params.id, { include: [{ all: true }] })
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.status(500).json({ error: err });
        });
};

exports.get_collections = (req, res) => {
    models.Collection.findAll({
        where: { seasonId: req.params.id}
    })
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.status(500).json({ error: err });
        });
}

exports.create = (req, res) => {
    models.Season.create(req.body, {
        include: [{
            model: models.Collection,
            as: 'collections'
        }]
    })
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.status(500).json({ error: err });
        });
};

exports.update = (req, res) => {
    models.Season.findById(req.params.id)
        .then(season => {
            season.updateAttributes(req.body);
        });
};

exports.delete = (req, res) => {
    models.Season.findById(req.params.id)
        .then(season => {
            if (season) {
                season.destroy();
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
