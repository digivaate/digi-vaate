const express = require('express');
const CollectionController = require('../controllers/CollectionController');

module.exports = (dbConnection) => {
    const router = express.Router();
    const collectionController = new CollectionController(dbConnection);

    router.get('/', collectionController.find_by_attribute);
    router.get('/products', collectionController.getAllProducts);
    router.get('/colors', collectionController.getAllColors);
    router.post('/', collectionController.create);
    router.patch('/', collectionController.update);
    router.delete('/', collectionController.delete);

    return router;
};
