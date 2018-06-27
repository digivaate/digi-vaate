import models from '../models/models';
import Controller from './Controller';

class CompanyController extends Controller {
    constructor() { super(models.Company); }

    getAllProducts(req, res) {
        models.Season.findAll({
            where: {
                companyId: req.query.id
            },
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