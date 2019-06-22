const Controller = require('./Controller');
import ProductController from "./ProductController";

class CollectionController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.collections) }

    setRelations = (entity, jsonBody) => {
        if (jsonBody.materials) entity.setMaterials(jsonBody.materials);
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

    find_by_attribute = (req, res) => {
        const properties = Controller.collectProperties(req.query, this.model, req.compAuth.companyId);
        if (properties.error) {
            res.stat(500).json(properties.error);
            return;
        }
        this.model.findAll({
            where: properties,
            include: [{
                all: true,
                include: [{ all: true }]
            }]
        })
            .then(ent => {
                res.send(ent);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    };

    getAllProducts = (req, res, next) => {
        const properties = Controller.collectProperties(req.query, this.model, req.compAuth.companyId);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        this.model.findOne({
            where: properties,
            include: [{
                model: this.dbConnection.models.products,
                as: 'products',
                include: [{all: true}],
                separate: true,
                order: [["name", "ASC"]],
            }]
        })
            .then(collection => {
                collection.products.forEach(product => product.dataValues.materialCosts = ProductController.calcMaterialCosts(product));
                res.send(collection.products);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    };

}

module.exports = CollectionController;