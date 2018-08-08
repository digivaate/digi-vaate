const Controller = require("./Controller");
const models = require("../models/models");

class OrderController extends Controller {
    constructor() { super(models.Order) }

    async setRelations(entity, jsonBody) {
        if(entity.orderProducts) delete entity.orderProducts;
    }

    //override
    find_by_attribute(req, res) {
        let orders = null;
        const properties = Controller.collectProperties(req.query, this.model);
        if (properties.error) {
            res.stat(500).json(properties.error);
            return;
        }
        this.model.findAll({
            where: properties,
            include: [{
                all: true,
                include: [{
                        model: models.Size,
                        as: 'sizes'
                    }]
            }]
        })
            .then(ent => {
                orders = ent;
                const promises = [];
                ent.forEach(order => {
                    order.orderProducts.forEach(ordProd => {
                        promises.push(
                            models.Product.findById(ordProd.productId, {
                                attributes: ['id', 'name', 'sellingPrice']
                            }).then(res => {
                                ordProd.dataValues.product = res;
                            })
                        );
                    });
                });
                return Promise.all(promises);
            })
            .then(() => {
                res.send(orders);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    }

    updateOrderProducts(req, res) {
        req.body.forEach(ordProd => {
            models.OrderProduct
        });
        const properties = Controller.collectProperties(req.query, models.Order);
        if (properties.error) {
            res.status(500).json(properties.error);
            return;
        }
        models.Order.findOne({ where: properties })
            .then(ent => {

            })
    }
}

module.exports = new OrderController();
