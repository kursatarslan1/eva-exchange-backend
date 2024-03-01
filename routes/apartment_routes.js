const express = require('express');
const router = express.Router();
const apartmentController = require('../controllers/apartment_controller');

router.use(express.json());

router.post('/createApartment', apartmentController.createApartment);
router.get('/getApartment', apartmentController.getApartment);
router.get('/getApartmentDetail', apartmentController.getApartmentDetail);
router.put('/updateApartment', apartmentController.updateApartment);

module.exports = router;