const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/trade_controller');

// GET trades by portfolio ID
router.get('/getTradeByPortfolioId', tradeController.getTradesByPortfolioId);

// GET buy history by user ID
router.get('/getBuyHistory', tradeController.GetBuyHistory);

// GET sell history by user ID
router.get('/getSellHistory', tradeController.GetSellHistory);

module.exports = router;
