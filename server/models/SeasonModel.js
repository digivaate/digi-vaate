const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, default: getDateTime()},
    budget: {type: Number, min: 0},
    collections: [],
});

module.exports = mongoose.model('Season', seasonSchema);

function getDateTime() {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    let day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ':' + month + ':' + day;
}
