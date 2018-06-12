const mongoose = require('mongoose');

const budgetPlanSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    deliveryWeeks: [
        {
            name: {type: String, required: true},
            products: [
                {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
            ]
        }
    ]
});

module.exports = mongoose.model('BudgetPlan', budgetPlanSchema);
