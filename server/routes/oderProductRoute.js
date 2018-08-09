const express = require('express');
const orderProductController = require('../controllers/orderProductController');
const router = express.Router();

router.get('/', orderProductController.find_by_attribute);
router.post('/', orderProductController.create);
router.patch('/', orderProductController.update);
router.delete('/', orderProductController.delete);

module.exports = router;
