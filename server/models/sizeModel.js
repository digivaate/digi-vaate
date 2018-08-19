module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define('sizes', {
        value: DataTypes.STRING,
        amount: DataTypes.INTEGER
    });

    Size.associate = (model) => {
        Size.belongsToMany(model.OrderProduct, {through: 'orderProduct_size'});
        Size.belongsToMany(model.Product, {through: 'size_product'});
    };

    return Size;
};