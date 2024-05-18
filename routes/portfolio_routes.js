const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfoloio_controller');

router.use(express.json());

router.get('/getPortfolioById', portfolioController.GetPortfolioById);

module.exports = router;