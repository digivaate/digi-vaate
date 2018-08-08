const Controller = require("./Controller");
const models = require("../models/models");

class OrderController extends Controller {
    constructor() {
        super(models.Order);
        this.updateOrderProducts = this.updateOrderProducts.bind(this);
        this.createOrderProducts = this.createOrderProducts.bind(this);
    }

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

    createOrderProducts = (relations, orderId) => {
        let promises = [];
        relations.forEach(rel => {
            promises.push(
                models.OrderProduct.create({
                    productId: rel.productId,
                    orderId: orderId
                })
            );
        });
        return Promise.all(promises)
            .then(orderProducts => {
                promises = [];
                for(let i in orderProducts) {
                    for (let j in relations[i].sizes) {
                        promises.push(
                            orderProducts[i].addSize(relations[i].sizes[j].sizeId, {through: {amount: relations[i].sizes[j].amount}})
                        )
                    }
                }
                return Promise.all(promises);
            })
            .catch(err => {
                console.error(err);
                return Promise.reject(err);
            });
    };

    updateOrderProducts(req, res, next) {
        const properties = Controller.collectProperties(req.query, models.Order);
        if (properties.error) {
            next(properties.error);
        }
        models.Order.findOne({ where: properties })
            .then( ent => {
                return this.createOrderProducts(req.body.products, ent.id);
            })
            .then(resolved => {
                console.log(resolved);
                res.send(resolved);
            })
            .catch(err => {
                next(err);
            })
    }
}

module.exports = new OrderController();
