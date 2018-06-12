const express = require('express');
const ProductController = require('../controllers/productController');
const router = express.Router();

router.get('/', ProductController.find_all);
router.get('/:productId', ProductController.find_by_id);
router.post('/', ProductController.create);
router.patch('/:productId', ProductController.edit);
router.delete('/:productId', ProductController.delete);

module.exports = router;
