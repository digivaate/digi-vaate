const express = require('express');
const SeasonController = require('../controllers/seasonController');
const router = express.Router();

router.get('/', SeasonController.find_all);
router.get('/search', SeasonController.find_by_attribute);
router.get('/:id', SeasonController.find_by_id);
router.post('/', SeasonController.create);
router.patch('/:id', SeasonController.update);
router.delete('/:id', SeasonController.delete);

module.exports = router;
