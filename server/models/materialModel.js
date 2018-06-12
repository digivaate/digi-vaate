const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required},
    weight: {type: Number, min: 0},
    width: {type: Number, min: 0},
    price: {type: Number, min: 0},
    minQuantity: {type: Number, min: 0},
    freight: {type: Number, min: 0},
    instructions: {type: String}, //??
    manufacturer: {type: String}, //??
    salesAgent: {type: String}, //??
    pattern: {}, //??
    composition: {}, //??
    colors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Color'}],
});

module.exports = mongoose.model('Material', materialSchema);
