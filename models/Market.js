// models/Market.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database_config');

const Market = sequelize.define('Market', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    share_symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    seller_portfolio_id: {
        type: DataTypes.INTEGER,
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
    last_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'market',
    timestamps: false
});

Market.GetMarket = async function() {
    try {
        return await Market.findAll();
    } catch (error) {
        console.log('Error getting market: ', error);
    }
};

Market.AddMarket = async function(share_symbol, seller_portfolio_id, quantity, price) {
    const today = new Date();
    try {
        const market = await Market.create({
            share_symbol,
            seller_portfolio_id,
            quantity,
            price,
            last_updated: today
        });
        return true;
    } catch (error) {
        console.log('Error adding market: ', error);
        return false;
    }
};

Market.GetShareInfoByMarketId = async function(market_id) {
    try {
        return await Market.findByPk(market_id, {
            attributes: ['share_symbol', 'seller_portfolio_id', 'quantity', 'price', 'id', 'last_updated']
        });
    } catch (error) {
        console.log('Error getting market information: ', error);
        return false;
    }
};

Market.RemoveShareFromMarket = async function(market_id, quantity, seller_portfolio_id) {
    try {
        const portfolio = await Portfolio.update(
            { quantity },
            { where: { portfolio_id: seller_portfolio_id } }
        );
        if (portfolio) {
            await Market.Delist(market_id);
        }
    } catch (error) {
        console.log('Error removing share on market: ', error);
        return false;
    }
};

Market.Delist = async function(market_id) {
    try {
        await Market.destroy({ where: { id: market_id } });
        return true;
    } catch (error) {
        console.log('Error delisting: ', error);
        return false;
    }
};

Market.UpdatePriceByMarketId = async function(market_id, new_price) {
    try {
        const result = await Market.update(
            { price: new_price },
            { where: { id: market_id } }
        );
        if (result) {
            await Market.UpdateDateByMarketId(market_id);
            return true;
        }
    } catch (error) {
        console.log('Error updating price: ', error);
        return false;
    }
};

Market.UpdateDateByMarketId = async function(market_id) {
    const currentTime = new Date();
    try {
        await Market.update(
            { last_updated: currentTime },
            { where: { id: market_id } }
        );
        return true;
    } catch (error) {
        console.log('Error updating date: ', error);
        return false;
    }
};

module.exports = Market;
