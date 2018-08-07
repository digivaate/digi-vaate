const express = require('express');
const OrderController = require('../controllers/orderController');
const router = express.Router();

router.get('/', OrderController.find_by_attribute);
router.post('/', OrderController.create);
router.patch('/', OrderController.update);
router.patch('/products', OrderController.updateOrderProducts);
router.delete('/', OrderController.delete);

module.exports = router;
