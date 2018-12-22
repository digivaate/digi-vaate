module.exports = (sequelize, DataTypes) => {
    const Season = sequelize.define('seasons', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        budget: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        coverPercent: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        }
    });

    Season.associate = (models) => {
        Season.hasMany(models.Collection, {as: 'collections'});
        Season.hasMany(models.Product, {as: 'products'});
        Season.belongsToMany(models.Color, {through: 'color_season'});
    };

    return Season;
};
