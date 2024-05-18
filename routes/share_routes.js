const express = require('express');
const router = express.Router();
const shareController = require('../controllers/share_controller');

// GET share by symbol
router.get('/getShareBySymbol', shareController.getShareByShareSymbol);

// GET all shares
router.get('/getShares', shareController.getAllShares);

// PUT sell share
router.put('/sellShare', shareController.sellShare);

// PUT buy share
router.put('/buyShare', shareController.buyShare);

module.exports = router;
