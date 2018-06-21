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
    models.Season.findById(req.params.id)
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
    models.Season.create(req.body)
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.status(500).json({ error: err });
        });
};

exports.set_collections = (req, res) => {
    models.Season.findById(req.params.id)
        .then(season => {
            season.setCollections()
        });
};

/*

exports.find_all_products = (req, res) => {
    Season.findById(req.params.id)
        .select('products collections')
        .populate('products')
        .populate('collections')
        .exec()
        .then(seasonDoc => {
            const products = [];
            Collection.populate(seasonDoc, {
                path: 'collections.products',
                model: 'Product'
            }, () => {
                products.push(seasonDoc.products);
                seasonDoc.collections.forEach((coll) => {
                    products.push(coll.products);
                });
                res.send(products);
            });
        });
};

exports.edit = (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for (let ops in req.body) {
        if (req.body.hasOwnProperty(ops)) {
            updateOps[ops] = req.body[ops];
        }
    }
    Season.update({ _id: id }, { $set: req.body })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Season.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

*/