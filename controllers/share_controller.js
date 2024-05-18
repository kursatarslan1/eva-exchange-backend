const Share = require("../models/Shares");
const User = require("../models/Users");
const Portfolio = require("../models/Portfolio");
const Market = require("../models/Market");
const { ShareSymbolValidation } = require("../helpers/check_symbol_validity");

async function getShareByShareSymbol(req, res) {
    const { symbol } = req.query;

    try {
        const share = await Share.findOne({ where: { symbol } });

        if (!share) { 
            return res.status(400).json({ error: "Share Not Found" });
        }

        res.json({ share });
    } catch (error) {
        console.error("Error getting share by symbol - in share controller: " + error);
        res.status(500).json({ error: "Unexpected error" });
    }
}

async function getAllShares(req, res) { 
    try {
        const shares = await Share.findAll();

        if (!shares || shares.length === 0) {
            return res.status(400).json({ error: "Shares Not Found" });
        }
        res.json({ shares });
    } catch (error) {
        console.error("Error getting shares - in share controller: " + error);
        res.status(500).json({ error: "Unexpected error" });
    }
}

async function buyShare(req, res) {
    const { user_id, market_id, quantity } = req.body;
    const marketInfo = await Market.findByPk(market_id);

    if (!marketInfo) { // validate market
        return res.status(400).json({ error: 'Market Not Found' });
    }
    
    const validateUser = await User.findByPk(user_id);
    if (!validateUser) {
        return res.status(400).json({ error: 'User Not Found' });
    }
    
    const buyer_portfolio = await Portfolio.GetOrCreatePortfolio(user_id, marketInfo.share_symbol); // get buyer portfolio by user_id and share_symbol
    try {
        const userBalance = validateUser.cash; // get user balance
        const symbolIsValid = await ShareSymbolValidation(marketInfo.share_symbol); // check share symbol is valid
        if (!symbolIsValid) {
            return res.status(400).json({ error: 'Symbol is not valid.' });
        } else if (quantity > marketInfo.quantity) { // if the quantity demanded is greater than the quantity in the market: 
            return res.status(400).json({ error: 'Quantity cannot be bigger than total quantity.' });
        } else if (quantity * marketInfo.price > userBalance) { // if the money to be paid is more than money user have:
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const buy = await Share.buyShare(marketInfo, buyer_portfolio, quantity); // if all conditions are met:
        if (!buy) {
            return res.status(400).json({ error: 'Unexpected Error' });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error("Error buying share - in share controller: " + error);
        res.status(500).json({ error: "Unexpected error" });
    }
}

async function sellShare(req, res) {
    const { share_symbol, portfolio_id, quantity, price } = req.body;

    try {
        const user_id = await Portfolio.GetUserIdByPortfolioId(portfolio_id);
        const symbolIsValid = await ShareSymbolValidation(share_symbol);
        const userShareQuantity = await Portfolio.GetShareQuantity(user_id, share_symbol);
        //validation
        if (!user_id) {
            return res.status(400).json({ error: 'User Not Found' });
        }
        if (!symbolIsValid) {
            return res.status(400).json({ error: 'Symbol is not valid' });
        }
        if (quantity > userShareQuantity) {
            return res.status(400).json({ error: 'Insufficient quantity' });
        }

        const sell = await Share.sellShare(user_id, share_symbol, portfolio_id, quantity, price, userShareQuantity);
        if (!sell) {
            return res.status(400).json({ error: 'Something went wrong' });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error("Error selling share - in share controller: " + error);
        res.status(500).json({ error: "Unexpected error" });
    }
}

module.exports = { getShareByShareSymbol, getAllShares, sellShare, buyShare };
