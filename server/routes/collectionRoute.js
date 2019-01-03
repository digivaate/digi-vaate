const express = require('express');

exports.collectionRoute = function (seqConnection) {
    const router = express.Router();
    const CollectionController = require('../controllers/collectionController')(seqConnection);

    router.get('/', CollectionController.find_by_attribute);
    router.get('/products', CollectionController.getAllProducts);
    router.get('/colors', CollectionController.getAllColors);
    router.post('/', CollectionController.create);
    router.patch('/', CollectionController.update);
    router.delete('/', CollectionController.delete);

    return router;
};
