const Portfolio = require("../models/Portfolio");

async function GetPortfolioById(req, res) {
    const { portfolio_id } = req.query;

    try {
        const portfolio = await Portfolio.findByPk(portfolio_id);

        if (!portfolio) {
            return res.status(400).json({ error: "Portfolio Not Found" });
        }

        res.json({ portfolio });
    } catch (error) {
        console.error("Error getting portfolio by id - in portfolio controller: " + error);
        res.status(500).json({ error: "Unexpected error" });
    }
}

module.exports = { GetPortfolioById };
