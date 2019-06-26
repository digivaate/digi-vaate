module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('companies', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        taxPercent: DataTypes.FLOAT
    });

    Company.associate = (models) => {
        Company.hasMany(models.collections, { as: 'collections' });
        Company.hasMany(models.images, { as: 'images' });
        Company.hasMany(models.materials, { as: 'materials' });
        Company.hasMany(models.orders, { as: 'orders' });
        Company.hasMany(models.orderProducts, { as: 'orderPorducts' });
        Company.hasMany(models.productGroups, { as: 'productGroups' });
        Company.hasMany(models.sizes, { as: 'sizes' });
        Company.hasMany(models.themes, { as: 'themes'});
        Company.hasMany(models.seasons, { as: 'seasons' });
        Company.hasMany(models.products, {as: 'products'});
        Company.belongsToMany(models.colors, {through: 'color_company'});
    };
    return Company;
};