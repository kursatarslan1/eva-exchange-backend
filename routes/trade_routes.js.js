const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/trade_controller');

router.use(express.json());

router.get('/getTradeByPortfolioId', tradeController.getTradesByPortfolioId);
router.get('/getBuyHistory', tradeController.GetBuyHistory);
router.get('/getSellHistory', tradeController.GetSellHistory);

module.exports = router;