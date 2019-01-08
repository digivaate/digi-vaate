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
        Material.belongsToMany(models.products, {through: 'material_product'});
        Material.belongsToMany(models.collections, {through: 'material_collection'});
    };
    return Material;
};
