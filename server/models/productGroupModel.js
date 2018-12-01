const normalizeString = require('../normalizeString');

module.exports = (sequelize, DataTypes) => {
    //odoo attribute variants as comments
    const ProductGroup = sequelize.define('productGroups', {
        name: { //name
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //No record can be created with similar name
                isUnique: (value, next) => {
                    ProductGroup.findAll({
                        attributes: [ 'name' ]
                    })
                        .then((groups) => {
                            let normValue = normalizeString(value);
                            groups.forEach(group => {
                                if (normalizeString(group.name) == normValue)
                                    return next('ProductGroup with ' + normValue + ' like name exists');
                            });
                            next()
                        })
                        .catch((err) => {
                            return next(err)
                        })
                }
            }
        }
    });

    ProductGroup.associate = (models) => {
        ProductGroup.hasMany(models.Product, {as: 'products'});
    };
    return ProductGroup;
};
