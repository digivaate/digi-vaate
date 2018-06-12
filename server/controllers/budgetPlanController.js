const BudgetPlan = require('../models/budgetPlanModel');
const mongoose = require('mongoose');

exports.find_all = (req, res) => {
    BudgetPlan.find()
        .populate({
            path: 'deliveryWeeks.products',
            model: 'Product',
            //select: 'name'
        })
        .exec()
        .then(docs => {
            /*
            for (let i=0; i<docs.length; i++) {
                for (let j=0; j<docs[i].deliveryWeeks.length; j++) {
                    for (let k=0; k<docs[i].deliveryWeeks[j].products.length; k++) {
                            docs[i].deliveryWeeks[j].products[k] = {
                                _id: docs[i].deliveryWeeks[j].products[k]._id,
                                name: docs[i].deliveryWeeks[j].products[k].name,
                                url: URL + 'product/' + docs[i].deliveryWeeks[j].products[k]._id,
                            };
                    }
                }
            }
            */
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
};

exports.find_by_id = (req, res) => {
    BudgetPlan.findById(req.params.budgetPlanId)
        .populate({
            path: 'deliveryWeeks.products',
            model: 'Product',
            //select: 'name'
        })
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
};

exports.create = (req, res) => {
    const budgetPlan = new BudgetPlan({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        deliveryWeeks: req.body.deliveryWeeks,
    });
    budgetPlan.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Budget plan stored',
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
    const id = req.params.budgetPlanId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propertyName] = ops.value;
    }
    BudgetPlan.update({ _id: id }, { $set: updateOps })
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
    BudgetPlan.remove({ _id: req.params.budgetPlanId})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};
