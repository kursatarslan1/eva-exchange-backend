const express = require('express');
const router = express.Router();
const apartmentExpenseController = require('../controllers/apartment_expense_controller');

router.use(express.json());

router.post('/createFixedExpense', apartmentExpenseController.createFixedExpense);
router.get('/getFixedExpenses', apartmentExpenseController.getFixedExpenses);
router.delete('/deleteFixedExpense', apartmentExpenseController.deleteFixedExpense);

module.exports = router;