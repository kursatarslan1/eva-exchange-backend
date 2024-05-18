const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market_controller');

// GET market
router.get('/getMarket', marketController.GetMarket);

// PUT remove share from market
router.put('/removeMarket', marketController.RemoveShareFromMarket);

// PUT update price by market id
router.put('/updatePrice', marketController.UpdatePriceByMarketId);

module.exports = router;
