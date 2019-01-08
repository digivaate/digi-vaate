const Controller = require('./Controller');
const ProductController = require("./ProductController");

class CompanyController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.companies); }

    setRelations = (entity, jsonBody) => {
        const promises = [];
        if (jsonBody.colors) {
            promises.push( entity.setColors(jsonBody.colors) );
        }
        return Promise.all(promises);
    };

    //populates with products
    getAllColors = (req, res) => {
        const properties = Controller.collectProperties(req.query, this.model);
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
        const properties = Controller.collectProperties(req.query, this.model);
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
                model: this.dbConnection.models.seasons,
                as: 'seasons',
                include: [
                    {
                        model: this.dbConnection.models.products,
                        as: 'products',
                        include: [{all: true}],
                        separate: true,
                        order: [["name", "ASC"]],
                    },{
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
            }]
        })
            .then(comp => {
                const products = [];
                comp.products.forEach(prod => {
                    products.push(prod);
                });
                comp.seasons.forEach(season => {
                    season.products.forEach(prod => {
                        prod.dataValues.seasonName = season.name;
                        products.push(prod);
                    });
                    season.collections.forEach(collection => {
                        collection.products.forEach(prod => {
                            prod.dataValues.seasonName = season.name;
                            prod.dataValues.collectionName = collection.name;
                            products.push(prod);
                        });
                    });
                });
                products.forEach(product => product.dataValues.materialCosts = ProductController.calcMaterialCosts(product));
                res.send(products);
            })
            .catch(err => {
                console.error(err);
                res.send(err);
            });
    };

}

module.exports = CompanyController;