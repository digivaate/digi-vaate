const models = require('../models/models');
const Controller = require('./Controller');

class ProductGroupController extends Controller {
    constructor() { super(models.ProductGroup); }
}

module.exports = new ProductGroupController();