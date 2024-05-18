const { Trade } = require("../models/trade_model");


async function getTradesByPortfolioId(req, res){
    const { portfolio_id } = req.query;

    try{
        const trades = await Trade.getTradesByPortfolioId(portfolio_id);

        if(!trades){
            return res.status(401).json({ error: "Trade Not Found" });
        }

        res.json({ trades });
    } catch (error){
        console.error("Error getting trades by portfolio id - in user controller: " + error);
        res.status(400).json({ error: "Unexpected error" });
    }
}

module.exports = { getTradesByPortfolioId };