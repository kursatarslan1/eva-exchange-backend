const { Debt } = require('../models/debt_model');

async function create(req, res){
    const { resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, status, debit_type } = req.body;

    try{
        const debtRes = await Debt.create(resident_id, apartment_id, block_id, unit_id, amount, created_at, payment_date, last_payment_date, description, status, debit_type);

        if(!debtRes){
            throw new Error('Request or complaints creation failed');
        }
        res.json({ success: 'true' });
    } catch(error) {
        console.error('Unexpected error: ', error);
        throw error;
    }
}

async function getDebtList(req, res){
    const { resident_id } = req.body;

    try{
        const result = await Debt.getDebtListByResidentId(resident_id);
        res.json({result});
    } catch(error) {
        console.error('Unexpected error: ', error);
        throw error;
    }
}

async function updateDebt(req, res){
    const { debt_id } = req.body;

    try{
        await Debt.PayDebt(debt_id);
        res.json({ message: 'Update debt. '});
    } catch(error) {
        console.error('Unexpected error: ', error);
        throw error;
    }
}

module.exports = { create, getDebtList, updateDebt };