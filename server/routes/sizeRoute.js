import SizeController from '../controllers/sizeController';
import express from 'express';

const router = express.Router();
const sizeController = new SizeController();

router.get('/', sizeController.find_by_attribute);
router.post('/', sizeController.create);
router.patch('/', sizeController.update);
router.delete('/', sizeController.delete);

module.exports = router;
