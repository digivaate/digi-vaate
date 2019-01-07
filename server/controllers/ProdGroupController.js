const Controller = require('./Controller');

class ProductGroupController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.productGroups); }
}

module.exports = ProductGroupController;