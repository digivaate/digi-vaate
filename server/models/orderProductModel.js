module.exports = (sequelize, DataTypes) => {
    const OrderProduct = sequelize.define('orderProducts', {
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    OrderProduct.associate = (models) => {
        OrderProduct.belongsToMany(models.Size, {through: 'orderProduct_size'});
    };

    return OrderProduct;
};
