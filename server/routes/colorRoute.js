const express = require('express');
const ColorController = require('../controllers/ColorController');

module.exports = (dbConnection) => {
    const router = express.Router();
    const colorController = new ColorController(dbConnection);

    router.get('/', colorController.find_by_attribute);
    router.post('/', colorController.validateValue);
    router.post('/', colorController.create);
    router.patch('/', colorController.validateValue);
    router.patch('/', colorController.update);
    router.delete('/', colorController.delete);

    return router;
};
