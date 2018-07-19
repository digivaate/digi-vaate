const express = require('express');
import ProductController from '../controllers/productController';
const router = express.Router();
import multer from '../multer';

const productController = new ProductController();

router.get('/', productController.find_by_attribute);
router.post('/', ProductController.clearOtherRelations, productController.create);
router.patch('/', ProductController.clearOtherRelations, productController.update);
router.patch('/image',productController.deleteImage, multer.single('image'), productController.uploadImage);
router.delete('/', productController.delete);

module.exports = router;
