const express = require('express');
const router = express.Router();
const apartmentController = require('../controllers/apartment_controller');

router.use(express.json());

router.post('/createApartment', apartmentController.createApartment);
router.get('/getApartment', apartmentController.getApartment);
router.get('/getApartmentDetail', apartmentController.getApartmentDetail);
router.put('/updateApartment', apartmentController.updateApartment);
router.get('/getBlockInfo', apartmentController.getBlockInfoByApartmentId);
router.get('/getUnitInfo', apartmentController.getUnitInfoByBlockId)
router.get('/getApartmentInfoById', apartmentController.getApartmentDetailById);

module.exports = router;