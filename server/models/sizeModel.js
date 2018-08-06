module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define('sizes', {
        value: DataTypes.STRING
    });

    Size.associate = (models) => {
        Size.belongsToMany(models.Product, {through: 'size_product'});
    };

    return Size;
};