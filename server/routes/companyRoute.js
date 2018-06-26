const express = require('express');
import CompanyController from '../controllers/companyController';
const router = express.Router();

router.get('/', CompanyController.find_by_attribute);
router.post('/', CompanyController.create);
router.patch('/:id', CompanyController.update);
router.delete('/:id', CompanyController.delete);

module.exports = router;
