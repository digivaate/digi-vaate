const Controller = require("./Controller");

class OrderProductController extends Controller {
    constructor(dbConnection) {
        super(dbConnection, dbConnection.models.orderProducts);
    }

    setRelations = async (entity, jsonBody) => {
        const promises = [];
        if (jsonBody.sizes) {
            await entity.setSizes([]);
            jsonBody.sizes.forEach(size => {
                promises.push(
                    entity.addSize(size.id, {through: { amount: size.amount } })
                );
            });
        }
        return Promise.all(promises);
    };

    //returns promise. Resolved value is boolean
    orderContainsProduct = (orderId, productId) => {
        return this.dbConnection.models.orders.findById(orderId, {
            attributes: ['id'],
            include: [{ model: this.model, as: 'orderProducts' }]
        })
            .then(order => {
                let match = false;
                order.dataValues.orderProducts.forEach(ordProd => {
                    if (ordProd.productId === productId) {
                        match = true;
                    }
                });
                return match;
            });
    };

    create = async (req, res, next) => {
        const contains = await this.orderContainsProduct(req.body.orderId, req.body.productId);
        if (contains) {
            res.status(409).json({ Error: 'product already in order' });
            return;
        }
        this.model.create(req.body)
            .then(async ent => {
                await this.setRelations(ent, req.body);
                res.send(ent);
            })
            .catch(err => next(err) );
    };

}

module.exports = OrderProductController;
