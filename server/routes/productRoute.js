const express = require('express');
const ProductController = require('../controllers/productController');
const router = express.Router();

router.get('/', ProductController.find_all);
router.get('/:id', ProductController.find_by_id);
router.post('/', ProductController.create);
router.patch('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;
