export default (sequelize, DataTypes) => {
    const Product = sequelize.define('products', {
        name: {
            type: DataTypes.STRING,
        }
    });

    Product.associate = (models) => {
        Product.hasMany(models.Material, {
            as: 'materials'
        });
        Product.hasMany(models.Color, {
            as: 'color'
        });
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