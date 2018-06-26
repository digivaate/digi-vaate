const express = require('express');
import SeasonController from '../controllers/seasonController';
const router = express.Router();

router.get('/', SeasonController.find_by_attribute);
router.post('/', SeasonController.create);
router.patch('/:id', SeasonController.update);
router.delete('/:id', SeasonController.delete);

module.exports = router;
