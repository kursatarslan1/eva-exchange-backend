const { Portfolio } = require("../models/portfolio_model");


async function GetPortfolioById(req, res){
    const { portfolio_id } = req.query;

    try{
        const portfolio = await Portfolio.GetPortfolioById(portfolio_id);

        if(!portfolio){
            return res.status(400).json({ error: "Portfolio Not Found" });
        }

        res.json({ portfolio });
    } catch (error){
        console.error("Error getting portfolio by symbol - in portfolio controller: " + error);
        res.status(400).json({ error: "Unexpected error" });
    }
}

module.exports = { GetPortfolioById };