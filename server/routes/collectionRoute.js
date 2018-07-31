const express = require('express');
import CollectionController from '../controllers/collectionController';
const router = express.Router();

router.get('/', CollectionController.find_by_attribute);
router.get('/products', CollectionController.getAllProducts);
router.get('/colors', CollectionController.getAllColors);
router.post('/', CollectionController.create);
router.patch('/', CollectionController.update);
router.delete('/', CollectionController.delete);

module.exports = router;
