import models from '../models/models';
import Controller from './Controller';
import ProductController from "./productController";

class CompanyController extends Controller {
    constructor() { super(models.Company); }

    setRelations(entity, jsonBody) {
        const promises = [];
        if (jsonBody.colors) {
            promises.push( entity.setColors(jsonBody.colors) );
        }
        return Promise.all(promises);
    }

    //populates with products
    getAllColors(req, res) {
        const properties = Controller.collectProperties(req.query, models.Company);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        models.Company.findOne({
            where: properties,
            include: [
                {
                    model: models.Color,
                    as: 'colors',
                    include: [
                        {
                            model: models.Product,
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
    }

    getAllProducts(req, res) {
        const properties = Controller.collectProperties(req.query, models.Company);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        models.Company.findOne({
            where: properties,
            include: [
                {
                    model: models.Product,
                    as: 'products',
                    include: [{all: true}],
                    separate: true,
                    order: [["name", "ASC"]],
                },
                {
                model: models.Season,
                as: 'seasons',
                include: [
                    {
                        model: models.Product,
                        as: 'products',
                        include: [{all: true}],
                        separate: true,
                        order: [["name", "ASC"]],
                    },{
                        model: models.Collection,
                        as: 'collections',
                        include: [{
                            model: models.Product,
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
                products.forEach(product => ProductController.addMaterialCosts(product));
                res.send(products);
            })
            .catch(err => {
                console.error(err);
                res.send(err);
            });
    }
}

export default new CompanyController();