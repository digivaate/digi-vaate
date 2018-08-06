const Controller = require("./Controller");
const models = require("../models/models");

class OrderController extends Controller {
    constructor() { super(models.Order) }

    async setRelations(entity, jsonBody) {
        const promeses = [];
        if (jsonBody.products) {
            await entity.setProducts([]);
            jsonBody.products.forEach(prod => {
                promeses.push(
                    entity.addProduct(prod.id, {
                        through:{
                            amount: prod.amount,
                            size: prod.size
                        }
                    })
                );
            });
        }
    }
}

module.exports = new OrderController();
