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
        .select('-__v')
        .populate('collections')
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if (doc) {
                doc.markModified('collections');
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
    const season = new Season({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        budget: req.body.budget,
        taxPercent: req.body.taxPercent,
        collections: req.body.collections
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
