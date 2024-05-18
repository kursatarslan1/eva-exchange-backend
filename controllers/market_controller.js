const Market = require("../models/Market");
const Portfolio = require("../models/Portfolio");

async function GetMarket(req, res) {
    try {
        const market = await Market.findAll();

        if (!market || market.length === 0) {
            return res.status(400).json({ error: "Market Not Found" });
        }

        res.json({ market });
    } catch (error) {
        console.log("Error getting market - in market controller: " + error);
        res.status(500).json({ error: "Unexpected error" });
    }
}

async function RemoveShareFromMarket(req, res) {
    const { user_id, market_id } = req.query;

    try {
        const marketInfo = await Market.findByPk(market_id);

        if (!marketInfo) {
            return res.status(400).json({ error: "Market Not Found" });
        }

        const sellerUserId = await Portfolio.GetUserIdByPortfolioId(marketInfo.seller_portfolio_id);
        const shareQuantity = await Portfolio.GetShareQuantity(user_id, marketInfo.share_symbol);

        if (user_id != sellerUserId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const newShareQuantity = shareQuantity + marketInfo.quantity;
        await Portfolio.update({ quantity: newShareQuantity }, { where: { user_id, share_symbol: marketInfo.share_symbol } });

        await Market.destroy({ where: { id: market_id } });

        return res.json({ success: true });
    } catch (error) {
        console.log('Error removing market: ', error);
        res.status(500).json({ error: "Unexpected error" });
    }
}

async function UpdatePriceByMarketId(req, res) {
    const { market_id, new_price } = req.body;

    try {
        const marketInfo = await Market.findByPk(market_id);

        if (!marketInfo) {
            return res.status(400).json({ error: "Market Not Found" });
        }

        const lastUpdatedDate = marketInfo.last_updated;
        const currentTime = new Date();

        const timeDifference = currentTime - lastUpdatedDate;
        const differenceInHours = timeDifference / (1000 * 60 * 60);

        if (differenceInHours >= 1) {
            await Market.update({ price: new_price, last_updated: currentTime }, { where: { id: market_id } });
            return res.json({ success: 'Price update successful.' });
        } else {
            return res.status(400).json({ error: 'You cannot update price before one hour.' });
        }
    } catch (error) {
        console.log('Error updating price: ', error);
        return res.status(500).json({ error: 'Unexpected error' });
    }
}

module.exports = { GetMarket, RemoveShareFromMarket, UpdatePriceByMarketId };
