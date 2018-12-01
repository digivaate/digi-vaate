const express = require('express');
const ProdGroupController = require('../controllers/prodGroupController');
const router = express.Router();

router.get('/', ProdGroupController.find_by_attribute);
router.post('/', ProdGroupController.create);
router.patch('/', ProdGroupController.update);
router.delete('/', ProdGroupController.delete);

module.exports = router;
