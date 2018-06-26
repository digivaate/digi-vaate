const express = require('express');
import ColorController from '../controllers/colorController';
const router = express.Router();

router.get('/', ColorController.find_by_attribute);
router.post('/', ColorController.create);
router.patch('/:id', ColorController.update);
router.delete('/:id', ColorController.delete);

module.exports = router;
