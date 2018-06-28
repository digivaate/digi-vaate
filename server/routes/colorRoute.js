const express = require('express');
import ColorController from '../controllers/colorController';
const router = express.Router();

router.get('/', ColorController.find_by_attribute);
router.post('/', ColorController.validateValue);
router.post('/', ColorController.create);
router.patch('/', ColorController.validateValue);
router.patch('/', ColorController.update);
router.delete('/', ColorController.delete);

module.exports = router;
