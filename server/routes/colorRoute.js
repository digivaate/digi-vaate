const express = require('express');
const ColorController = require('../controllers/colorController');
const router = express.Router();

router.get('/', ColorController.find_all);
router.get('/:id', ColorController.find_by_id);
router.post('/', ColorController.create);
router.patch('/:id', ColorController.edit);
router.delete('/:id', ColorController.delete);

module.exports = router;
