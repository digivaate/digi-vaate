const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
   res.status(200).json({
      message: 'Orders was fetched'
   });
});

router.post('/', (req, res, next) => {
    const order = {
        orderId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(200).json({
        message: 'Order was created'
    });
});

router.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderID: req.params.orderID
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted'
    });
});

module.exports = router;