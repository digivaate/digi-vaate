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
        taxPercent: DataTypes.FLOAT,
    });

    Company.associate = (models) => {
        Company.hasMany(models.seasons, { as: 'seasons' });
        Company.hasMany(models.products, {as: 'products'});
        Company.belongsToMany(models.colors, {through: 'color_company'});
    };
    return Company;
};