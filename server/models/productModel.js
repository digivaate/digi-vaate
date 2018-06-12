const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    taxPercent: {type: Number, min: 0, max: 100},
    resellerProfitPercent: {type: Number, min: 0, max: 100},
    coverPercent: {type: Number, min: 0, max: 100},
    commercialPrice: {type: Number, min: 0},
    subcCosts: [{
        name: { type: String },
        amount: { type: Number, min: 0 }
    }],
    materials: [{
        material: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
        consumption: {type: Number, min: 0},
    }]
});

module.exports = mongoose.model('Product', productSchema);
