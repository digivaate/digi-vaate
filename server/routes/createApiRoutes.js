const express = require('express');

export default function (dbConnection) {
    const router = express.Router();

    /*
    router.use('/collection', require('./collectionRoute')(dbConnection));
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
    router.use('/productgroup', require('./prodGroupRoute'));
*/
    router.use('/user', require('./userRoute')(dbConnection) );

    return router;
};