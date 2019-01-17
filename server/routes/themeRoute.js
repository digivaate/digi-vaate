const express = require('express');
const ThemeController = require('../controllers/ThemeController');
const multer = require("../multer");

module.exports = (dbConnection) => {
    const router = express.Router();
    const themeController = new ThemeController(dbConnection);

    router.get('/', themeController.find_by_attribute);
    router.post('/', themeController.create);
    router.patch('/', themeController.update);
    router.patch('/:id/image/', multer.single('image'), themeController.uploadImage);
    router.delete('/', themeController.delete);
    router.delete('/:id/image/:imageName', themeController.deleteImage);

    return router;
};
