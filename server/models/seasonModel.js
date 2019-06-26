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
        },
        ownerCompany: {
            type: DataTypes.INTEGER
        }
    });

    Season.associate = (models) => {
        Season.hasMany(models.collections, {as: 'collections'});
        Season.hasMany(models.products, {as: 'products'});
        Season.belongsToMany(models.colors, {through: 'color_season'});
    };

    return Season;
};
