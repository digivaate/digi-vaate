export default (sequelize, DataTypes) => {
    const Product = sequelize.define('products', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Product.associate = (models) => {
        Product.belongsToMany(models.Material, {through: 'material_product'});
        Product.belongsToMany(models.Color, {through: 'color_product'});
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