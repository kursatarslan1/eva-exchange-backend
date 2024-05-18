// models/Trade.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database_config');
const Portfolio = require('./Portfolio');
const { Op } = require('sequelize');

const Trade = sequelize.define('Trade', {
    trade_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    seller_portfolio_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    buyer_portfolio_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    trade_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'trade',
    timestamps: false
});

Trade.getTradesByPortfolioId = async function(portfolio_id) {
    try {
        return await Trade.findAll({
            where: {
                [Op.or]: [
                    { seller_portfolio_id: portfolio_id },
                    { buyer_portfolio_id: portfolio_id }
                ]
            }
        });
    } catch (error) {
        console.log('Error getting trade by portfolio id: ', error);
        return false;
    }
};

Trade.AddTradeLog = async function(seller_portfolio_id, buyer_portfolio_id, symbol, quantity, price, trade_timestamp) {
    try {
        await Trade.create({
            seller_portfolio_id,
            buyer_portfolio_id,
            symbol,
            quantity,
            price,
            trade_timestamp
        });
        return true;
    } catch (error) {
        console.log('Error adding trade to db: ', error);
        return false;
    }
};

Trade.GetBuyHistoryByUserId = async function(user_id) {
    try {
        const portfolioIds = await Portfolio.GetPortfolioIdsByUserId(user_id);
        let combinedResults = [];

        for (let idCount = 0; idCount < portfolioIds.length; idCount++) {
            const index = portfolioIds[idCount];
            const trades = await Trade.findAll({
                where: { buyer_portfolio_id: index }
            });
            combinedResults = combinedResults.concat(trades);
        }
        return combinedResults;
    } catch (error) {
        console.log('Error getting buy history by user id: ', error);
        return false;
    }
};

Trade.GetSellHistoryByUserId = async function(user_id) {
    try {
        const portfolioIds = await Portfolio.GetPortfolioIdsByUserId(user_id);
        let combinedResults = [];

        for (let idCount = 0; idCount < portfolioIds.length; idCount++) {
            const index = portfolioIds[idCount]
            const trades = await Trade.findAll({
                where: { seller_portfolio_id: index }
            });
            combinedResults = combinedResults.concat(trades);
        }
        return combinedResults;
    } catch (error) {
        console.log('Error getting sell history by user id: ', error);
        return false;
    }
};

module.exports = Trade;
