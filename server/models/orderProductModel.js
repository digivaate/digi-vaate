module.exports = (seqelize, DataTypes) => {
    const OrderProduct = seqelize.define('orderProducts', {

    });
    OrderProduct.associate = (models) => {
        OrderProduct.belongsToMany(models.Size, {through: 'orderProduct_size'});
    };

    return OrderProduct;
};
