const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio_controller');

router.get('/getPortfolioById', portfolioController.GetPortfolioById);
router.get('/getPortfolio', portfolioController.GetPortfolio);

module.exports = router;
