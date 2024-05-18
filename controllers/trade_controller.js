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
        console.error("Error getting trades by portfolio id - in trade controller: " + error);
        res.status(400).json({ error: "Unexpected error" });
    }
}

async function GetBuyHistory(req, res){
    const { user_id } = req.query;

    try{
        const result = await Trade.GetBuyHistoryByUserId(user_id);
        if(!result){
            return res.status(400).json({ error: 'Unexpected error' });
        }
        return res.json({ result });
    } catch (error) {
        console.error("Error getting buy history by user id - in trade controller: " + error);
        res.status(400).json({ error: "Unexpected error" });
    }
}

async function GetSellHistory(req, res){
    const { user_id } = req.query;

    try{
        const result = await Trade.GetSellHistoryByUserId(user_id);
        if(!result){
            return res.status(400).json({ error: 'Unexpected error' });
        }
        return res.json({ result });
    } catch (error) {
        console.error("Error getting sell history by user id - in trade controller: " + error);
        res.status(400).json({ error: "Unexpected error" });
    }
}

module.exports = { getTradesByPortfolioId, GetBuyHistory, GetSellHistory };