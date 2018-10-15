module.exports = (sequelize, DataTypes) => {
    const Color = sequelize.define('colors', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            unique: 'code'
        },
        value: {
            type: DataTypes.STRING
        }
    });

    Color.associate = (models) => {
        Color.belongsToMany(models.Product, {through: 'color_product'});
        Color.belongsToMany(models.Collection, {through: 'color_collection'});
        Color.belongsToMany(models.Season, {through: 'color_season'});
        Color.belongsToMany(models.Company, {through: 'color_company'});
    };

    return Color;
};
