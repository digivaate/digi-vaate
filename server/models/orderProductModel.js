module.exports = (sequelize, DataTypes) => {
    const OrderProduct = sequelize.define('orderProducts', {
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ownerCompany: {
            type: DataTypes.INTEGER
        }
    });
    OrderProduct.associate = (models) => {
        OrderProduct.belongsToMany(models.sizes, {through: 'orderProduct_size'});
    };

    return OrderProduct;
};
