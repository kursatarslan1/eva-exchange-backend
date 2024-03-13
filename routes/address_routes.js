const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address_controller');

router.use(express.json());

router.get('/getCountry', addressController.getCountry);
router.get('/getCity', addressController.getCity);
router.get('/getState', addressController.getState);
router.get('/getCityByName', addressController.getCityByName);
router.get('/getStateByName', addressController.getStateByName);

module.exports = router;