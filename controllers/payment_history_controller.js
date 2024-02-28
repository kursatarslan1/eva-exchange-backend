const { PaymentHistory } = require('../models/payment_history_model');

async function createPayment(req, res){
    const { resident_id, apartment_id, amount, payment_date, payment_method, description, payment_type } = req.body;

    try{
        const paymentHistoryResult = await PaymentHistory.create(resident_id, apartment_id, amount, payment_date, payment_method, description, payment_type);

        if(!paymentHistoryResult){
            res.status(500).json({error: 'Getting error execution create payment history'});
        }
        
        res.json({ success: 'true' });
    } catch(error) {
        console.error('Unexpected error: ', error);
        throw error;
    }
}

async function getPaymentHistory(req, res){
    const { resident_id } = req.body;

    try{
        const result = await PaymentHistory.getPaymentHistoryById(resident_id);
        res.json({result});
    } catch(error) {
        console.error('Unexpected error: ', error);
        throw error;
    }
}

module.exports = { createPayment, getPaymentHistory };