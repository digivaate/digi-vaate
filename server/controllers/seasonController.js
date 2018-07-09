import models from '../models/models';
import Controller from './Controller';

class SeasonController extends Controller {
    constructor() { super(models.Season); }

    getAllProducts(req, res) {

        const properties = Controller.collectProperties(req.query, models.Season);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        models.Season.findOne({
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
            .then(season => {
                const products = [];
                season.collections.forEach(collection => {
                    collection.products.forEach(prod => {
                        products.push(prod);
                    });
                });
                res.send(products);
            })
            .catch(err => {
                console.error('Error finding all products: ' + err);
                res.status(500).json({ error: err });
            })
    }
}

export default new SeasonController();