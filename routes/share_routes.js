const express = require('express');
const router = express.Router();
const shareController = require('../controllers/share_controller');

router.get('/getShareBySymbol', shareController.getShareByShareSymbol);
router.get('/getShares', shareController.getAllShares);
router.put('/sellShare', shareController.sellShare);
router.put('/buyShare', shareController.buyShare);

module.exports = router;
