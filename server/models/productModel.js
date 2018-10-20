module.exports = (sequelize, DataTypes) => {
    //odoo attribute variants as comments
    const Product = sequelize.define('products', {
        name: { //name
            type: DataTypes.STRING,
            allowNull: false
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
        }
    });

    Product.associate = (models) => {
        Product.belongsToMany(models.Material, {through: 'material_product'});
        Product.belongsToMany(models.Color, {through: 'color_product'});
        Product.belongsToMany(models.Size, {through: 'size_product'});
        Product.hasMany(models.OrderProduct, {as: 'orderProducts'});
    };
    return Product;
};

/*
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    resellerProfitPercent: {type: Number, min: 0, max: 100},
    coverPercent: {type: Number, min: 0, max: 100},
    commercialPrice: {type: Number, min: 0},
    subcCosts: [{
        name: { type: String },
        amount: { type: Number, min: 0 }
    }],
    materials: [{
        material: {type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true, },
        consumption: {type: Number, min: 0},
    }]
});

module.exports = mongoose.model('Product', productSchema);
*/