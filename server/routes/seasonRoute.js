const express = require('express');
const SeasonController = require('../controllers/seasonController');
const router = express.Router();

router.get('/', SeasonController.find_by_attribute);
router.get('/products', SeasonController.getAllProducts);
router.get('/colors', SeasonController.getAllColors);
router.post('/', SeasonController.create);
router.patch('/', SeasonController.update);
router.patch('/products', SeasonController.updateProducts);
router.delete('/', SeasonController.delete);

module.exports = router;
