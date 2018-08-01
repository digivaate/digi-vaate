export default (sequelize, DataTypes) => {
    const Order = sequelize.define('orders', {
        price: DataTypes.FLOAT,
        status: DataTypes.STRING,
        deliveryCosts: DataTypes.FLOAT,
        taxPercent: DataTypes.FLOAT,
        supplier: DataTypes.STRING,
        vat: DataTypes.STRING,
        invoicingAddress: DataTypes.STRING,
        deliveryAddress: DataTypes.STRING,
        deliveryTime: DataTypes.DATE,
        deliveryTerms: DataTypes.STRING,
        paymentTerms: DataTypes.STRING,
        brandLabel: DataTypes.STRING,
        info: DataTypes.STRING
    });

    Order.associate = (models) => {
        Order.belongsToMany(models.Product, {through:'order_product'} );
    };

    return Order;
}