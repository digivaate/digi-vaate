const express = require('express');
const ProductController = require('../controllers/ProductController');
const multer = require('../multer');

module.exports = (dbConnection) => {
    const router = express.Router();
    const productController = new ProductController(dbConnection);

    //TODO: Update multering
    router.get('/', productController.find_by_attribute);
    router.get('/image', productController.getImage);
    router.post('/', ProductController.clearOtherRelations, productController.create);
    router.patch('/', ProductController.clearOtherRelations, productController.update);
    router.patch('/image', multer.single('image'), productController.uploadImage);
    router.delete('/', productController.delete);

    return router;
};
