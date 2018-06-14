const express = require('express');
const MaterialController = require('../controllers/materialController');
const router = express.Router();

router.get('/', MaterialController.find_all);
router.get('/:id', MaterialController.find_by_id);
router.post('/', MaterialController.create);
router.patch('/:id', MaterialController.edit);
router.delete('/:id', MaterialController.delete);

module.exports = router;
