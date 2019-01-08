const express = require('express');
const CompanyController = require('../controllers/CompanyController');

module.exports = (dbConnection) => {
    const router = express.Router();
    const companyController = new CompanyController(dbConnection);

    router.get('/', companyController.find_by_attribute);
    router.get('/products', companyController.getAllProducts);
    router.get('/colors', companyController.getAllColors);
    router.post('/', companyController.create);
    router.patch('/', companyController.update);
    router.delete('/', companyController.delete);

    return router;
};
