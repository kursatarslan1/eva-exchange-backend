const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/trade_controller');

router.use(express.json());

router.get('/getTradeByPortfolioId', tradeController.getTradesByPortfolioId);

module.exports = router;