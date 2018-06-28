import models from '../models/models';
import Controller from './Controller';

class CompanyController extends Controller {
    constructor() { super(models.Company); }

    getAllProducts(req, res) {
        const properties = Controller.prototype.collectProperties.call(req.query);
        if (properties.error) {
            res.stat(500).json(properties);
            return;
        }
        models.Collection.findAll({
            where: properties,
            include: [{
                model: models.Collection,
                as: 'collections',
                include: [{
                    model: models.Product,
                    as: 'products'
                }]
            }]
        })
            .then(ent => {
                const products = [];
                ent.forEach(season => {
                    season.collections.forEach(collection => {
                        collection.products.forEach(product => {
                            products.push(product);
                        });
                    });
                });
                res.send(products);
            })
            .catch(err => {
                console.error(err);
                res.send(err);
            });
    }
}

export default new CompanyController();