const express = require('express');
const SizeController = require('../controllers/SizeController');

module.exports = (dbConnection) => {
    const router = express.Router();
    const sizeController = new SizeController(dbConnection);

    router.get('/', sizeController.find_by_attribute);
    router.post('/', sizeController.create);
    router.patch('/', sizeController.update);
    router.delete('/', sizeController.delete);

    return router;
};
