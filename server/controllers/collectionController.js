import models from '../models/models';

exports.find_all = (req, res) => {
    models.Collection.findAll()
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.send({ error: err })
        });
};

exports.create = (req, res) => {
    console.log(req.body);
    models.Collection.create(req.body)
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.status(500).json({ error: err });
        });
};

/*
exports.find_by_id = (req, res) => {
    Collection.findById(req.params.id)
        .select('-__v')
        .populate({path: 'colors'})
        .populate({path: 'materials'})
        .populate({path: 'products'})
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if (doc) {
                doc.markModified('colors');
                doc.markModified('materials');
                doc.markModified('products');
                res.status(200).json(doc);
                doc.save();
            } else {
                res.status(404).json({message: 'No valid entry found'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
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
    Collection.update({ _id: id }, { $set: updateOps})
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
    Collection.remove({ _id: id})
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