const express = require('express');
const router = express.Router();
const paymentHistoryController = require('../controllers/payment_history_controller');

router.use(express.json());

router.post('/createPayment', paymentHistoryController.createPayment);
router.get('/getPaymentHistory', paymentHistoryController.getPaymentHistory);

module.exports = router;