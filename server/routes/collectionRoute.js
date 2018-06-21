const express = require('express');
const CollectionController = require('../controllers/collectionController');
const router = express.Router();

router.get('/', CollectionController.find_all);
//router.get('/:id', CollectionController.find_by_id);
router.post('/', CollectionController.create);
//router.patch('/:id', CollectionController.edit);
//router.delete('/:id', CollectionController.delete);

module.exports = router;
