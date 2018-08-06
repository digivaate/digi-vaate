const express = require('express');
const CompanyController = require('../controllers/companyController');
const router = express.Router();

router.get('/', CompanyController.find_by_attribute);
router.get('/products', CompanyController.getAllProducts);
router.get('/colors', CompanyController.getAllColors);
router.post('/', CompanyController.create);
router.patch('/', CompanyController.update);
router.delete('/', CompanyController.delete);

module.exports = router;
