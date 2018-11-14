const normalizeString = require('../normalizeString');

module.exports = (sequelize, DataTypes) => {
    const Color = sequelize.define('colors', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUnique: (value, next) => {
                    Color.findAll({
                        attributes: [ 'name' ]
                    })
                        .then((colors) => {
                            let normValue = normalizeString(value);
                            colors.forEach(color => {
                                if (normalizeString(color.name) == normValue)
                                    return next('Color with similar name exists');
                            });
                            next()
                        })
                        .catch((err) => {
                            return next(err)
                        })
                }
            }
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
