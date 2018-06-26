const express = require('express');
const SeasonController = require('../controllers/seasonController');
const router = express.Router();

router.get('/', SeasonController.find_by_attribute);
router.post('/', SeasonController.create);
router.patch('/:id', SeasonController.update);
router.delete('/:id', SeasonController.delete);

module.exports = router;
