const express = require('express');
import CompanyController from '../controllers/companyController';
const router = express.Router();

router.get('/', CompanyController.find_by_attribute);
router.get('/products', CompanyController.getAllProducts);
router.post('/', CompanyController.create);
router.patch('/', CompanyController.update);
router.delete('/', CompanyController.delete);

module.exports = router;
