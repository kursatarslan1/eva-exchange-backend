const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio_controller');

// GET portfolio by ID
router.get('/getPortfolioById', portfolioController.GetPortfolioById);

module.exports = router;
