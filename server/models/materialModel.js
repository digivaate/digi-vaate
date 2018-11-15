const normalizeString = require('../normalizeString');

module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define('materials', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //No record can be created with similar name
                isUnique: (value, next) => {
                    Material.findAll({
                        attributes: [ 'name' ]
                    })
                        .then((materials) => {
                            let normValue = normalizeString(value);
                            materials.forEach(material => {
                                if (normalizeString(material.name) == normValue)
                                    return next('Material with ' + normValue + ' like name exists');
                            });
                            next()
                        })
                        .catch((err) => {
                            return next(err)
                        })
                }
            }
        },
        code: DataTypes.STRING,
        unitPrice: DataTypes.FLOAT,
        freight: DataTypes.FLOAT,
        weight: DataTypes.FLOAT,
        weightUnit: DataTypes.STRING,
        width: DataTypes.FLOAT,
        widthUnit: DataTypes.STRING,
        minQuantity: DataTypes.INTEGER,
        instructions: DataTypes.STRING,
        manufacturer: DataTypes.STRING,
        composition: DataTypes.STRING
    });

    Material.associate = (models) => {
        Material.belongsToMany(models.Product, {through: 'material_product'});
        Material.belongsToMany(models.Collection, {through: 'material_collection'});
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