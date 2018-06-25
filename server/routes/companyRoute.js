const express = require('express');
const CompanyController = require('../controllers/companyController');
const router = express.Router();

router.get('/', CompanyController.find_all);
router.get('/:id', CompanyController.find_by_id);
router.post('/', CompanyController.create);
router.patch('/:id', CompanyController.update);
router.delete('/:id', CompanyController.delete);

module.exports = router;
