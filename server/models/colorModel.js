const normalizeString = require('../normalizeString');

module.exports = (sequelize, DataTypes) => {
    const Color = sequelize.define('colors', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            /*
            validate: {
                //No record can be created with similar name
                isUnique: (value, next) => {
                    Color.findAll({
                        attributes: [ 'name' ]
                    })
                        .then((colors) => {
                            let normValue = normalizeString(value);
                            colors.forEach(color => {
                                if (normalizeString(color.name) == normValue)
                                    return next('Color with ' + normValue + ' like name exists');
                            });
                            next()
                        })
                        .catch((err) => {
                            return next(err)
                        })
                }
            }
               */
        },
        code: {
            type: DataTypes.STRING,
            //unique: 'code'
        },
        value: {
            type: DataTypes.STRING
        },
        ownerCompany: {
            type: DataTypes.INTEGER
        }
    });

    Color.associate = (models) => {
        Color.belongsToMany(models.products, {through: 'color_product'});
        Color.belongsToMany(models.collections, {through: 'color_collection'});
        Color.belongsToMany(models.seasons, {through: 'color_season'});
        Color.belongsToMany(models.companies, {through: 'color_company'});
    };

    return Color;
};
