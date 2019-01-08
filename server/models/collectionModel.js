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
        Collection.belongsToMany(models.colors, {through: 'color_collection'});
        Collection.belongsToMany(models.materials, {through: 'material_collection'});
        Collection.hasMany(models.orders, {as: 'orders'});
        Collection.hasMany(models.products, {as: 'products'});
        Collection.hasOne(models.themes);
    };
    return Collection;
};
