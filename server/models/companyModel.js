module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('companies', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        taxPercent: DataTypes.FLOAT
    });

    Company.associate = (models) => {
        Company.hasMany(models.Season, { as: 'seasons' });
        Company.hasMany(models.Product, {as: 'products'});
        Company.hasMany(models.User, {as: 'users'});
        Company.belongsToMany(models.Color, {through: 'color_company'});
    };
    return Company;
};