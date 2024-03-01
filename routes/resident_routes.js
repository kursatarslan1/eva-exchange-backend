const express = require('express');
const router = express.Router();
const residentController = require('../controllers/resident_controller');

router.use(express.json());

router.post('/login', residentController.login);
router.post('/register', residentController.register);
router.put('/deactive', residentController.deactive);
router.get('/getInformationByEmail', residentController.getInformationByEmail);
router.put('/updateResidentInfo', residentController.updateResident);

module.exports = router;