const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debt_controller');

router.use(express.json());

router.post('/create', debtController.create);
router.get('/getDebt', debtController.getDebtList);
router.put('/payDebt', debtController.updateDebt);

module.exports = router;