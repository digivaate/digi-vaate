const express = require('express');
import ProductController from '../controllers/productController';
const router = express.Router();

router.get('/', ProductController.find_by_attribute);
router.post('/', ProductController.create);
router.patch('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;
