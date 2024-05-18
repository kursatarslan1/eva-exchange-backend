const { DataTypes } = require('sequelize');
const sequelize = require('../config/database_config');
const User  = require('../models/Users');

const Portfolio = sequelize.define('Portfolio', {
    portfolio_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    share_symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'portfolio',
    timestamps: false
});

Portfolio.GetPortfolioById = async function(portfolio_id) {
    try {
        return await Portfolio.findByPk(portfolio_id);
    } catch (error) {
        console.log('Error getting portfolio by id: ', error);
    }
};

Portfolio.GetUserIdByPortfolioId = async function(portfolio_id) {
    try {
        const portfolio = await Portfolio.findByPk(portfolio_id, { attributes: ['user_id'] });
        return portfolio ? portfolio.user_id : null;
    } catch (error) {
        console.log('Error getting user id by portfolio id: ', error);
        return false;
    }
};

Portfolio.GetPortfolioIdsByUserId = async function(user_id) {
    try {
        const portfolios = await Portfolio.findAll({ where: { user_id }, attributes: ['portfolio_id'] });
        return portfolios.map(p => p.portfolio_id);
    } catch (error) {
        console.log('Error getting portfolio ids by user id: ', error);
        return false;
    }
};

Portfolio.GetShareQuantity = async function(user_id, share_symbol) {
    try {
        const portfolio = await Portfolio.findOne({ where: { user_id, share_symbol }, attributes: ['quantity'] });
        return portfolio ? portfolio.quantity : null;
    } catch (error) {
        console.log('Error getting share quantity: ', error);
        return false;
    }
};

Portfolio.GetOrCreatePortfolio = async function(user_id, share_symbol) { // when a user buys a share, it is checked whether the user has a portfolio for that share or not, or it is created.
    try {
        let portfolio = await Portfolio.findOne({ where: { user_id, share_symbol } });
        if (!portfolio) {
            portfolio = await Portfolio.create({ user_id, share_symbol, quantity: 0 });
        }
        return portfolio.portfolio_id;
    } catch (error) {
        console.log('Error getting or creating portfolio: ', error);
        return false;
    }
};

Portfolio.GetUserPortfolio = async function(user_id){ // Returns the portfolio owned by the user
    try{
        const userBalance = await User.GetBalanceByUserId(user_id);
        const portfolio = await Portfolio.findAll({ where: { user_id: user_id } });
        return { userBalance, portfolio };
    } catch (error) {
        console.log('Error getting portfolio: ', error);
        return false;
    }
}

module.exports = Portfolio;
