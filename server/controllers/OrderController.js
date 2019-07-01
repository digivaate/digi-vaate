const Controller = require("./Controller");

class OrderController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.orders) }

    setRelations = (entity, jsonBody) => {
        if(entity.orderProducts) delete entity.orderProducts;
    };

    //override
    find_by_attribute = (req, res) => {
        let orders = null;
        const properties = Controller.collectProperties(req.query, this.model, req.compAuth.companyId);
        if (properties.error) {
            res.stat(500).json(properties.error);
            return;
        }
        this.model.findAll({
            where: properties,
            include: [{
                all: true,
                include: [{
                        model: this.dbConnection.models.sizes,
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
                            this.dbConnection.models.products.findByPk(ordProd.productId, {
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

}

module.exports = OrderController;
