const { Share } = require("../models/share_model");
const { User } = require("../models/users_model");
const { Portfolio } = require("../models/portfolio_model");
const { Market } = require("../models/market_model");
const { ShareSymbolValidation } = require("../helpers/check_symbol_validity");

async function getShareByShareSymbol(req, res) {
    const { symbol } = req.query;

    try {
        const share = await Share.GetShareByShareSymbol(symbol);

        if (!share) {
            return res.status(400).json({ error: "Share Not Found" });
        }

        res.json({ share });
    } catch (error) {
        console.error("Error getting share by symbol - in share controller: " + error);
        res.status(400).json({ error: "Unexpected error" });
    }
}

async function getAllShares(req, res) {
    try {
        const shares = await Share.getAllShares();

        if (!shares) {
            return res.status(400).json({ error: "Share Not Found" });
        }
        res.json({ shares });
    } catch (error) {
        console.error("Error getting shares - in share controller: " + error);
        res.status(400).json({ error: "Unexpected error" });
    }
}

async function buyShare(req, res) {
    const { user_id, market_id, quantity } = req.body;
    const marketInfo = await Market.GetShareInfoByMarketId(market_id);

    if(!marketInfo){
        return res.status(400).json({ error: 'market not found' });
    }
    
    const validateUser = await User.GetUserById(user_id);
    if (!validateUser) {
        return res.status(400).json({ error: 'user not found' });
    }
    
    const buyer_portfolio_id = await Portfolio.GetOrCreatePortfolio(user_id, marketInfo.share_symbol);
    try {
        const userBalance = await User.GetBalanceByUserId(user_id);
        const symbolIsValid = await ShareSymbolValidation(marketInfo.share_symbol);
        if (!symbolIsValid) {
            return res.status(400).json({ error: 'symbol is not valid.' });
        } else if (quantity > marketInfo.quantity) {
            return res.status(400).json({ error: 'quantity cannot be bigger than total quantity.' });
        } else if (quantity * marketInfo.price > userBalance) {
            return res.status(400).json({ error: 'sufficient balance' });
        }

        const buy = await Share.buyShare(marketInfo, buyer_portfolio_id, quantity);
        if (!buy) {
            return res.status(400).json({ error: 'Unexpected Error' });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error("Error buying share - in share controller: " + error);
        res.status(400).json({ error: "Unexpected error" });
    }
}

async function sellShare(req, res) {
    const {share_symbol, portfolio_id, quantity, price } = req.body;

    try {
        const user_id = await Portfolio.GetUserIdByPortfolioId(portfolio_id);
        const symbolIsValid = await ShareSymbolValidation(share_symbol);
        const userShareQuantity = await Portfolio.GetShareQuantity(user_id, share_symbol);
        if (!user_id) {
            return res.status(400).json({ error: 'user not found' });
        }
        if (!symbolIsValid) {
            return res.status(400).json({ error: 'symbol is not valid' });
        }
        if (quantity > userShareQuantity) {
            return res.status(400).json({ error: 'sufficient quantity' });
        }

        const sell = await Share.sellShare(user_id, share_symbol, portfolio_id, quantity, price, userShareQuantity);
        if (!sell) {
            return res.status(400).json({ error: 'something went wrong, i believe i can fly' });
        }
        return res.json({ succes: true });
    } catch (error) {
        console.error("Error selling share - in share controller: " + error);
        res.status(400).json({ error: "Unexpected error" });
    }
}

module.exports = { getShareByShareSymbol, getAllShares, sellShare, buyShare };