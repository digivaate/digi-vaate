import Collection from '../models/collectionModel';
import mongoose from 'mongoose';

exports.find_all = (req, res) => {
    Collection.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
};


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

exports.create = (req, res) => {
    const collection = new Collection({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        colors: req.body.colors,
        theme: req.body.theme,
        materials: req.body.materials,
        products: req.body.products
    });
    collection.save()
        .then(result => {
            res.status(201).json({
                message: 'Collection stored',
                created: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Create failed',
                error: err
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
