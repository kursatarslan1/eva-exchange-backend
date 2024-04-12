const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unit_controller');

router.use(express.json());

router.put('/updateNote', unitController.createNote);
router.get('/getUnitAddressByUnitId', unitController.getUnitAddressByUnitId)

module.exports = router;