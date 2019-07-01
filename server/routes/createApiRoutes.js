const express = require('express');

module.exports = function (dbConnection) {
    const router = express.Router();

    router.use('/collection', require('./collectionRoute')(dbConnection));
    router.use('/color', require('./colorRoute')(dbConnection));
    router.use('/company', require('./companyRoute')(dbConnection));
    router.use('/material', require('./materialRoute')(dbConnection));
    router.use('/product', require('./productRoute')(dbConnection));
    router.use('/season', require('./seasonRoute')(dbConnection));
    router.use('/theme', require('./themeRoute')(dbConnection));
    router.use('/size', require('./sizeRoute')(dbConnection));
    router.use('/order', require('./orderRoute')(dbConnection));
    router.use('/orderproduct', require('./oderProductRoute')(dbConnection));
    router.use('/image', require('./imageRoute')(dbConnection));
    router.use('/productgroup', require('./prodGroupRoute')(dbConnection));
    
    return router;
};