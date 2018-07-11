const express = require('express');
import MaterialController from '../controllers/materialController';
const router = express.Router();
import multer from '../multer';

router.get('/', MaterialController.find_by_attribute);
router.post('/', MaterialController.create);
router.patch('/', MaterialController.update);
router.patch('/:id/image', multer.single('image'), MaterialController.uploadImage);
router.delete('/', MaterialController.delete);
router.delete('/:id/image', MaterialController.deleteImage);

module.exports = router;
