const express = require('express');
const ProdGroupController = require('../controllers/ProdGroupController');

module.exports = function (dbConnection) {
    const router = express.Router();
    const prodGroupController = new ProdGroupController(dbConnection);

    router.get('/', prodGroupController.find_by_attribute);
    router.post('/', prodGroupController.create);
    router.patch('/', prodGroupController.update);
    router.delete('/', prodGroupController.delete);

    return router;
};
