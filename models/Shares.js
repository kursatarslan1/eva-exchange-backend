// models/Share.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database_config');
const Market = require('./Market');
const Portfolio = require('./Portfolio');
const User = require('./Users');
const Trade = require('./Trades');

const Share = sequelize.define('Share', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    last_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'shares',
    timestamps: false
});

Share.GetShareByShareSymbol = async function(symbol) {
    try {
        return await Share.findOne({ where: { symbol } });
    } catch (error) {
        console.log('Error getting share by symbol: ', error);
    }
};

Share.getAllShares = async function() {
    try {
        return await Share.findAll();
    } catch (error) {
        console.log('Error getting all shares: ', error);
    }
};

Share.buyShare = async function(marketInfo, buyer_portfolio_id, quantity) {
    const buyer_user_id = await Portfolio.GetUserIdByPortfolioId(buyer_portfolio_id);
    const shareQuantity = await Portfolio.GetShareQuantity(buyer_user_id, marketInfo.share_symbol);

    const currentTime = new Date();

    try {
        await Portfolio.update(
            { quantity: shareQuantity + quantity },
            { where: { portfolio_id: buyer_portfolio_id } }
        );

        const buyerUserBalance = await User.GetBalanceByUserId(buyer_user_id);
        await User.update(
            { cash: Number(buyerUserBalance) - Number((quantity * marketInfo.price)) },
            { where: { user_id: buyer_user_id } }
        );

        const seller_user_id = await Portfolio.GetUserIdByPortfolioId(marketInfo.seller_portfolio_id);
        const sellerUserBalance = await User.GetBalanceByUserId(seller_user_id);

        await User.update(
            { cash: Number(sellerUserBalance) + Number((quantity * marketInfo.price)) },
            { where: { user_id: seller_user_id } }
        );

        if (marketInfo.quantity === quantity) { // if the number of shares in the market is the same as the number of shares purchased, there is no need for that share to remain in the market
            await Market.Delist(marketInfo.id);
        } else {
            const remainQuantity = marketInfo.quantity - quantity;
            await Market.update(
                { quantity: remainQuantity },
                { where: { id: marketInfo.id } }
            );
        }

        const tradeResult = await Trade.AddTradeLog(marketInfo.seller_portfolio_id, buyer_portfolio_id, marketInfo.share_symbol, quantity, marketInfo.price, currentTime);
        return !!tradeResult;

    } catch (error) {
        console.log(error);
        return false;
    }
};

Share.sellShare = async function(user_id, share_symbol, portfolio_id, quantity, price, user_share_quantity) {
    try {
        await Portfolio.update(
            { quantity: user_share_quantity - quantity },
            { where: { user_id, share_symbol } }
        );

        await Market.AddMarket(share_symbol, portfolio_id, quantity, price);
        return true;

    } catch (error) {
        console.log('Error selling share: ', error);
        return false;
    }
};

module.exports = Share;
