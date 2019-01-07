const express = require('express');
const ProductController = require('../controllers/productController');
const multer = require('../multer');

const productController = new ProductController();

router.get('/', productController.find_by_attribute);
router.get('/image', productController.getImage);
router.post('/', ProductController.clearOtherRelations, productController.create);
router.patch('/', ProductController.clearOtherRelations, productController.update);
router.patch('/image', multer.single('image'), productController.uploadImage);
router.delete('/', productController.delete);

module.exports = (dbConnection) => {
    const router = express.Router();
    //TODO: PRODUCT TO NEW VERSION
};
