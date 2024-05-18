const Trade = require("../models/Trades");
const sequelize = require('../config/database_config');
const { Op } = require('sequelize');

async function getTradesByPortfolioId(req, res) {
    const { portfolio_id } = req.query;

    try {
        const trades = await Trade.findAll({
            where: {
                [Op.or]: [
                    { seller_portfolio_id: portfolio_id },
                    { buyer_portfolio_id: portfolio_id }
                ]
            }
        });

        if (!trades || trades.length === 0) {
            return res.status(401).json({ error: "Trades Not Found" });
        }

        res.json({ trades });
    } catch (error) {
        console.error("Error getting trades by portfolio id - in trade controller: " + error);
        res.status(500).json({ error: "Unexpected error" });
    }
}

async function GetBuyHistory(req, res) {
    const { user_id } = req.query;
    
    try {
        const result = await Trade.GetBuyHistoryByUserId(user_id);
        if (!result || result.length === 0) {
            return res.status(400).json({ error: 'Buy history not found' });
        }
        return res.json({ result });
    } catch (error) {
        console.error("Error getting buy history by user id - in trade controller: " + error);
        res.status(500).json({ error: "Unexpected error" });
    }
}

async function GetSellHistory(req, res) {
    const { user_id } = req.query;

    try {
        const result = await Trade.GetSellHistoryByUserId(user_id);
        if (!result || result.length === 0) {
            return res.status(400).json({ error: 'Sell history not found' });
        }
        return res.json({ result });
    } catch (error) {
        console.error("Error getting sell history by user id - in trade controller: " + error);
        res.status(500).json({ error: "Unexpected error" });
    }
}

module.exports = { getTradesByPortfolioId, GetBuyHistory, GetSellHistory };
