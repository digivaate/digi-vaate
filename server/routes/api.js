const express = require('express');
const router = express.Router();

router.use('/collection', require('./collectionRoute'));
router.use('/color', require('./colorRoute'));
router.use('/company', require('./companyRoute'));
router.use('/material', require('./materialRoute'));
router.use('/product', require('./productRoute'));
router.use('/season', require('./seasonRoute'));
router.use('/theme', require('./themeRoute'));
router.use('/size', require('./sizeRoute'));
router.use('/order', require('./orderRoute'));
router.use('/orderproduct', require('./oderProductRoute'));
router.use('/image', require('./imageRoute'));

module.exports = router;