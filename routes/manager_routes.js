const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager_controller');

router.use(express.json());

router.post('/login', managerController.login);
router.post('/register', managerController.register);
router.put('/deactive', managerController.deactive);

module.exports = router;