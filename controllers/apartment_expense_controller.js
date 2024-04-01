const { ApartmentExpense } = require('../models/apartment_expense_model');

async function createFixedExpense(req, res){
    const { apartment_id, expense_name, expense_amount, expense_period, expense_content } = req.body;

    try{
        const fixedExpenseResult = await ApartmentExpense.createFixedExpense(apartment_id, expense_name, expense_amount, expense_period, expense_content);

        if(!fixedExpenseResult){
            res.status(500).json({ success: false });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}

async function getFixedExpenses(req, res){
    const { apartment_id } = req.query;

    try{
        const fixedExpensesResult = await ApartmentExpense.getFixedExpenses(apartment_id);

        if(!fixedExpensesResult){
            res.status(500).json({ success: false });
        }
        res.json({ fixedExpensesResult });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}

async function deleteFixedExpense(req, res){
    const {expense_id} = req.query;

    try{
        const resultFixedStatus = await ApartmentExpense.deleteFixedExpense(expense_id);

        if(!resultFixedStatus){
            res.status(500).json({ success: false});
        }

        res.json({success: true});
    }catch(error){
        res.status(500).json({success: false});
    }
}

async function updateFixedExpense(req, res){
    const { expense_id, expense_name, expense_amount, expense_period, expense_content } = req.body;

    try{
        const updateFixedExpenseResult = await ApartmentExpense.updateFixedExpense(expense_id, expense_name, expense_amount, expense_period, expense_content);
        if(!updateFixedExpense){
            res.json({ success: false });
        }
        res.json({ success: true });
    } catch (error){
        res.json({ success: false });
    }
}

module.exports = {createFixedExpense, getFixedExpenses , deleteFixedExpense, updateFixedExpense }