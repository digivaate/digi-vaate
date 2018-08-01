export default (sequelize, DataTypes) => {
    const Order = sequelize.define('orders', {
        date: DataTypes.DATE,
        price: DataTypes.FLOAT,
        deliveryCosts: DataTypes.FLOAT,
        taxPercent: DataTypes.FLOAT
    });

    Order.associate = (models) => {
        Order.belongsToMany(models.Product, {through:'order_product'} );
    };

    return Order;
}