const Controller = require('./Controller');

class ColorController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.colors) }

    setRelations = (entity, jsonBody) => {
        if (jsonBody.products) entity.setProducts(jsonBody.products);
        if (jsonBody.collections) entity.setCollections(jsonBody.collections);
        if (jsonBody.companies) entity.setCompanies(jsonBody.companies);
        if (jsonBody.seasons) entity.setSeasons(jsonBody.seasons);
    };

    validateValue = (req, res, next) => {
        if (!req.body.value || req.body.value.match(/^#(?:[0-9a-f]{3}){1,2}$/i) ) {
            next();
        } else {
            res.status(500).json({error: 'value is not in correct hex format'});
        }
    };

}

module.exports = ColorController;
