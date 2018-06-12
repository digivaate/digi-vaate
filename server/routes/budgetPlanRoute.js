const express = require('express');
const BudgetPlanController = require('../controllers/budgetPlanController');
const router = express.Router();

router.get('/', BudgetPlanController.find_all);
router.get('/:budgetPlanId', BudgetPlanController.find_by_id);
router.post('/', BudgetPlanController.create);
router.patch('/:budgetPlanId', BudgetPlanController.edit);
router.delete('/:budgetPlanId', BudgetPlanController.delete);

module.exports = router;
