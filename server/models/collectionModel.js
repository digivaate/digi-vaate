const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required},
    colors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Color'}],
    theme: {},
    materials: [{type: mongoose.Schema.Types.ObjectId, ref: 'Material'}],
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

module.exports = mongoose.model('Collection', collectionSchema);
