export default (sequelize, DataTypes) => {
    const Material = sequelize.define('materials', {
        name: {
            type: DataTypes.STRING,
        }
    });

    Material.associate = (models) => {

    };
    return Material;
};

/*
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true },
    weight: {type: Number, min: 0}, //grams
    width: {type: Number, min: 0}, //m
    price: {type: Number, min: 0}, //
    minQuantity: {type: Number, min: 0},
    freight: {type: Number, min: 0},
    instructions: {type: String}, //puhdasta teksti'
    manufacturer: {type: String}, //puhds teksti
    salesAgent: {type: String}, //puhdas teksti
    pattern: {}, //name, code, color
    composition: {}, //text
    colors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }],
});

module.exports = mongoose.model('Material', materialSchema);
*/