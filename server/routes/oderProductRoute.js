const express = require('express');
const OrderProductController = require('../controllers/OrderProductController');

module.exports = function (dbConnection) {
    const router = express.Router();
    const orderProductController = new OrderProductController(dbConnection);

    router.get('/', orderProductController.find_by_attribute);
    router.post('/', orderProductController.create);
    router.patch('/', orderProductController.update);
    router.delete('/', orderProductController.delete);

    return router;
};
