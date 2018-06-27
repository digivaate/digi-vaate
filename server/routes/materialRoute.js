const express = require('express');
import MaterialController from '../controllers/materialController';
const router = express.Router();

router.get('/', MaterialController.find_by_attribute);
router.post('/', MaterialController.create);
router.patch('/', MaterialController.update);
router.delete('/:id', MaterialController.delete);

module.exports = router;
