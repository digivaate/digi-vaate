const express = require('express');
const SeasonController = require('../controllers/seasonController');
const router = express.Router();

router.get('/', SeasonController.find_all);
router.get('/:id', SeasonController.find_by_id);
router.get('/:id/collections', SeasonController.get_collections);
//router.get('/:id/products', SeasonController.find_all_products);
router.post('/', SeasonController.create);
//router.patch('/:id', SeasonController.set_collections);
//router.delete('/:id', SeasonController.delete);

module.exports = router;
