const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market_controller');

router.use(express.json());

router.get('/getMarket', marketController.GetMarket);
router.put('/removeMarket', marketController.RemoveShareFromMarket);
router.put('/updatePrice', marketController.UpdatePriceByMarketId);

module.exports = router;