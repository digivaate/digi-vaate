import models from '../models/models';
import Controller from './Controller';

class SeasonController extends Controller {
    constructor() { super(models.Season); }

    getAllProducts(req, res) {
        const properties = this.collectProperties(req.query);
        if (properties.error) {
            res.stat(500).json(properties);
            return;
        }
        models.Collection.findAll({
            where: properties,
            include: [{
                model: models.Product,
                as: 'products'
            }]
        })
            .then(collections => {
                console.log(collections);
                const products = [];
                collections.forEach(collection => {
                    collection.products.forEach(prod => {
                        products.push(prod);
                    });
                });
                res.send(products);
            })
            .catch(err => {
                console.error('Error finding all products: ' + err);
                res.stat(500).json({ error: err });
            })
    }
}

export default new SeasonController();