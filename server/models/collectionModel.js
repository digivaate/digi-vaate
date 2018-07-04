export default (sequelize, DataTypes) => {
    const Collection = sequelize.define('collections', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Collection.associate = (models) => {
        Collection.belongsToMany(models.Color, {through: 'color_collection'});
        Collection.belongsToMany(models.Material, {through: 'material_collection'});
        Collection.hasMany(models.Product, {as: 'products'});
    };
    return Collection;
};
/*
const collectionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true },
    colors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Color'}],
    theme: {}, //pictures
    materials: [{type: mongoose.Schema.Types.ObjectId, ref: 'Material'}],
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});
*/