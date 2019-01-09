const express = require('express');
const SeasonController = require('../controllers/SeasonController');

module.exports = (dbConnection) => {
    const router = express.Router();
    const seasonController = new SeasonController(dbConnection);

    router.get('/', seasonController.find_by_attribute);
    router.get('/products', seasonController.getAllProducts);
    router.get('/colors', seasonController.getAllColors);
    router.post('/', seasonController.create);
    router.patch('/', seasonController.update);
    router.patch('/products', seasonController.updateProducts);
    router.delete('/', seasonController.delete);

    return router;
};
