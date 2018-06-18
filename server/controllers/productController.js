const Product = require('../models/productModel');
const mongoose = require('mongoose');

exports.find_all = (req, res) => {
    Product.find()
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
    Product.findById(req.params.id)
        .select('-__v')
        .populate({ path: 'materials.material' })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
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
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        resellerProfitPercent: req.body.resellerProfitPercent,
        coverPercent: req.body.coverPercent,
        commercialPrice: req.body.commercialPrice,
        subcCosts: req.body.subcCosts,
        materials: req.body.materials
    });
    product.save()
        .then(result => {
            res.status(201).json({
                message: 'Product stored',
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
    console.log(updateOps);
    Product.update({ _id: id }, { $set: updateOps })
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
    Product.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};
