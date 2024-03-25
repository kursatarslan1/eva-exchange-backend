const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account_controller');

router.use(express.json());

router.post('/createAccount', accountController.createAccount);
router.get('/getAccounts', accountController.getAccounts);
router.put('/updateAccount', accountController.updateAccount);
router.delete('/deleteAccount', accountController.deleteAccount);

module.exports = router;