const Season = require('../models/seasonModel');
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
        .exec()
        .then(doc => {
            console.log('From database', doc);
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
    const season = new Season({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        resellerProfitPercent: req.body.resellerProfitPercent,
        coverPercent: req.body.coverPercent,
        commercialPrice: req.body.commercialPrice,
        subcCosts: req.body.subcCosts,
        materials: req.body.materials
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
    for (const ops of req.body) {
        updateOps[ops.propertyName] = ops.value;
    }
    Season.update({ _id: id }, { $set: updateOps})
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
