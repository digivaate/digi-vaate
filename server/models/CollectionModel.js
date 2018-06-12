const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    colors: [],
    theme: {},
    materials: []
});

module.exports = mongoose.model('Collection', collectionSchema);
