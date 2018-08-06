const express = require('express');
const ThemeController = require('../controllers/themeController');
const multer = require("../multer");
const router = express.Router();

router.get('/', ThemeController.find_by_attribute);
router.post('/', ThemeController.create);
router.patch('/', ThemeController.update);
router.patch('/:id/image/', multer.single('image'), ThemeController.uploadImage);
router.delete('/', ThemeController.delete);
router.delete('/:id/image/:imageName', ThemeController.deleteImage);

module.exports = router;
