const express = require('express');
const OrderController = require('../controllers/OrderController');

module.exports = (dbConnection) => {
    const router = express.Router();
    const orderController = new OrderController(dbConnection);

    router.get('/', orderController.find_by_attribute);
    router.post('/', orderController.create);
    router.patch('/', orderController.update);
    router.delete('/', orderController.delete);

    return router;
};
