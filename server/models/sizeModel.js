module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define('sizes', {
        value: DataTypes.STRING,
        amount: DataTypes.INTEGER,
        ownerCompany: {
            type: DataTypes.INTEGER
        }
    });

    Size.associate = (model) => {
        Size.belongsToMany(model.orderProducts, {through: 'orderProduct_size'});
        Size.belongsToMany(model.products, {through: 'size_product'});
    };

    return Size;
};