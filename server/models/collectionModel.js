module.exports = (sequelize, DataTypes) => {
    const Collection = sequelize.define('collections', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coverPercent: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        }
    });

    Collection.associate = (models) => {
        Collection.belongsToMany(models.Color, {through: 'color_collection'});
        Collection.belongsToMany(models.Material, {through: 'material_collection'});
        Collection.hasMany(models.Order, {as: 'orders'});
        Collection.hasMany(models.Product, {as: 'products'});
        Collection.hasOne(models.Theme);
    };
    return Collection;
};
