const express = require('express');
const MaterialController = require('../controllers/materialController');
const router = express.Router();
const multer = require('../multer');

router.get('/', MaterialController.find_by_attribute);
router.get('/image', MaterialController.getImage);
router.post('/', MaterialController.create);
router.patch('/', MaterialController.update);
router.patch('/image', multer.single('image'), MaterialController.uploadImage);
router.delete('/', MaterialController.delete);

module.exports = router;
