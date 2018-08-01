const express = require('express');
import OrderController from '../controllers/orderController';
const router = express.Router();

router.get('/', OrderController.find_by_attribute);
router.post('/', OrderController.create);
router.patch('/', OrderController.update);
router.delete('/', OrderController.delete);

module.exports = router;
