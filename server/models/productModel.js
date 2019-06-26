const normalizeString = require('../normalizeString');

module.exports = (sequelize, DataTypes) => {
    //odoo attribute variants as comments
    const Product = sequelize.define('products', {
        name: { //name
            type: DataTypes.STRING,
            allowNull: false,
            /*
            validate: {
                //No record can be created with similar name
                isUnique: (value, next) => {
                    Product.findAll({
                        attributes: [ 'name' ]
                    })
                        .then((products) => {
                            let normValue = normalizeString(value);
                            products.forEach(product => {
                                if (normalizeString(product.name) == normValue)
                                    return next('Product with ' + normValue + ' like name exists');
                            });
                            next()
                        })
                        .catch((err) => {
                            return next(err)
                        })
                }
            }
            */
        },
        code: {
            type: DataTypes.STRING
        },
        sellingPrice: { //list_price
            type: DataTypes.FLOAT
        },
        resellerProfitPercent: {
            type: DataTypes.FLOAT
        },
        taxPercent: {
            type: DataTypes.FLOAT
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        subcCostTotal: {
            type: DataTypes.FLOAT
        },
        ownerCompany: {
            type: DataTypes.INTEGER
        }
    });

    Product.associate = (models) => {
        Product.belongsToMany(models.materials, {through: 'material_product'});
        Product.belongsToMany(models.colors, {through: 'color_product'});
        Product.belongsToMany(models.sizes, {through: 'size_product'});
        Product.hasMany(models.orderProducts, {as: 'orderProducts'});
    };
    return Product;
};
