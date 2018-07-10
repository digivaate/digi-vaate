const express = require('express');
import ProductController from '../controllers/productController';
const router = express.Router();
import multer from '../multer';

router.get('/', ProductController.find_by_attribute);
router.post('/', ProductController.create);
router.patch('/', ProductController.update);
router.patch('/image', ProductController.deleteImage, multer.single('image'), ProductController.uploadImage);
router.delete('/', ProductController.delete);

module.exports = router;
