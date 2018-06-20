const Season = require('../models/seasonModel');
import Collection from '../models/collectionModel';
const mongoose = require('mongoose');

exports.find_all = (req, res) => {
    Season.find()
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
    Season.findById(req.params.id)
        .select('-__v')
        .populate('collections')
        .populate('products')
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if (doc) {
                doc.markModified('collections');
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
/*
exports.find_all_products = (req, res) => {
    const products = [];
    Season.findById(req.params.id)
        .select('products collections')
        .populate('products')
        .exec()
        .then(seasonDoc => {
            products.push(seasonDoc.products);
            seasonDoc.collections.forEach((collectionId) => {
                try {
                    Collection.findById(collectionId)
                        .select('products')
                        .populate('products')
                        .exec()
                        .then(collectionDoc => {
                            console.log(collectionDoc);
                            products.push(collectionDoc.products);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } catch (e) {
                    console.log(e);
                }
            })
                .then(() => {
                    res.send(products);
                });
        })
        .catch(err => {
            res.status(500).json({ error: err })
        });
};
*/

exports.create = (req, res) => {
    const season = new Season({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        budget: req.body.budget,
        taxPercent: req.body.taxPercent,
        collections: req.body.collections,
        products: req.body.products
    });
    season.save()
        .then(result => {
            res.status(201).json({
                message: 'Stored',
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
