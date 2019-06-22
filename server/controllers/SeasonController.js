import ProductController from "./ProductController";

const Controller = require('./Controller');

class SeasonController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.seasons) }

    setRelations = (entity, jsonBody) => {
        if (jsonBody.colors) entity.setColors(jsonBody.colors);
    };

    //populates with products
    getAllColors = (req, res) => {
        const properties = Controller.collectProperties(req.query, this.model, req.compAuth.companyId);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        this.model.findOne({
            where: properties,
            include: [
                {
                    model: this.dbConnection.models.colors,
                    as: 'colors',
                    include: [
                        {
                            model: this.dbConnection.models.products,
                            as: 'products',
                            attributes: ['name', 'id']
                        }
                    ]
                }
            ]
        })
            .then(ent => {
                const colors = [];
                ent.colors.forEach(color => colors.push(color));
                res.send(colors);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    };

    getAllProducts = (req, res) => {

        const properties = Controller.collectProperties(req.query, this.model, req.compAuth.companyId);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        this.model.findOne({
            where: properties,
            include: [
                {
                    model: this.dbConnection.models.products,
                    as: 'products',
                    include: [{all: true}],
                    separate: true,
                    order: [["name", "ASC"]],
                },
                {
                    model: this.dbConnection.models.collections,
                    as: 'collections',
                    include: [{
                        model: this.dbConnection.models.products,
                        as: 'products',
                        include: [{all: true}],
                        separate: true,
                        order: [["name", "ASC"]],
                }]
            }]
        })
            .then(season => {
                const products = [];
                season.collections.forEach(collection => {
                    collection.products.forEach(prod => {
                        prod.dataValues.seasonName = season.name;
                        prod.dataValues.collectionName = collection.name;
                        products.push(prod);
                    });
                });
                season.products.forEach(prod => {
                    prod.dataValues.seasonName = season.name;
                    products.push(prod);
                });
                products.forEach(product => product.dataValues.materialCosts = ProductController.calcMaterialCosts(product));
                res.send(products);
            })
            .catch(err => {
                console.error('Error finding all products: ' + err);
                res.status(500).json({ error: err });
            })
    };

    //updates product values that changed in table. Checks if values are in a limit of the budget
    updateProducts = (req, res) => {
        this.model.findOne({
            where: { name: req.body.seasonName, companyId: req.compAuth.companyId },
            include: [
                {
                    model: this.dbConnection.models.products,
                    as: 'products',
                    include: [{all: true}],
                    separate: true,
                    order: [["name", "ASC"]],
                },
                {
                    model: this.dbConnection.models.collections,
                    as: 'collections',
                    include: [{
                        model: this.dbConnection.models.products,
                        as: 'products',
                        include: [{all: true}],
                        separate: true,
                        order: [["name", "ASC"]],
                    }]
                }]
        })
            .then(season => {
                const products = [];
                season.collections.forEach(collection => {
                    collection.products.forEach(prod => {
                        products.push(prod);
                    });
                });
                season.products.forEach(prod => {
                    products.push(prod);
                });
                let purchasingPrice = 0;
                req.body.products.forEach(modProd => {
                    for (let i = 0; i < products.length; i++) {
                        if (products[i].id === modProd.id) {
                            products[i].amount = modProd.amount;
                        }
                    }
                });
                products.forEach(prod => {
                    purchasingPrice += prod.amount * ProductController.calcPurchasingPrice(prod);
                });
                console.log(purchasingPrice);
                console.log(season.budget);
                if (season.budget > purchasingPrice) {
                    const promises = [];
                    req.body.products.forEach(prod => {
                        this.dbConnection.models.products.findById(prod.id)
                            .then(ent => {
                                promises.push(
                                    ent.updateAttributes(prod)
                                )
                            });
                    });
                    Promise.all(promises)
                        .then(resolved => {
                            res.send(resolved);
                        });
                } else {
                    res.status(500).json({ error: 'over budget' });
                }
            })
            .catch(err => {
                console.error('Error finding all products: ' + err);
                res.status(500).json({ error: err });
            })
    }
}

module.exports = SeasonController;
