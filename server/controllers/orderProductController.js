const Controller = require("./Controller");
const models = require("../models/models");

class OrderProductController extends Controller {
    constructor() {
        super(models.OrderProduct);
        this.create = this.create.bind(this);
        this.orderContainsProduct = this.orderContainsProduct.bind(this);
    }

    async setRelations(entity, jsonBody) {
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
    }

    //returns promise. Resolved value is boolean
    orderContainsProduct(orderId, productId) {
        return models.Order.findById(orderId, {
            attributes: ['id'],
            include: [{ model: models.OrderProduct, as: 'orderProducts' }]
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
    }

    async create(req, res, next) {
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

module.exports = new OrderProductController();
