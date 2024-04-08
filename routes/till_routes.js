const express = require('express');
const router = express.Router();
const tillController = require('../controllers/till_controller');

router.use(express.json());

router.get('/getAllTillInfo', tillController.getAllTillInfo);
router.get('/getBlockTillInfo', tillController.getBlockTillInfoByBlockId);
router.get('/getAccounting', tillController.getAccounting);

module.exports = router;