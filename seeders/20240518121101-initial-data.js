'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userData = [
      { username: 'user1', cash: 1000 },
      { username: 'user2', cash: 1500 },
      { username: 'user3', cash: 2000 },
      { username: 'user4', cash: 1200 },
      { username: 'user5', cash: 1800 }
    ];

    const shareData = [
      { symbol: 'ABC', price: 10.25 },
      { symbol: 'DEF', price: 15.50 },
      { symbol: 'GHI', price: 8.75 },
      { symbol: 'JKL', price: 12.80 },
      { symbol: 'MNO', price: 18.60 }
    ];

    const tradeData = [
      { seller_portfolio_id: 1, buyer_portfolio_id: 2, symbol: 'ABC', quantity: 10, price: 10.25 },
      { seller_portfolio_id: 3, buyer_portfolio_id: 1, symbol: 'DEF', quantity: 5, price: 15.50 },
      { seller_portfolio_id: 4, buyer_portfolio_id: 2, symbol: 'GHI', quantity: 8, price: 8.75 },
      { seller_portfolio_id: 2, buyer_portfolio_id: 5, symbol: 'JKL', quantity: 12, price: 12.80 },
      { seller_portfolio_id: 5, buyer_portfolio_id: 3, symbol: 'MNO', quantity: 15, price: 18.60 }
    ];

    const portfolioData = [
      { user_id: 1, share_symbol: 'ABC', quantity: 20 },
      { user_id: 2, share_symbol: 'DEF', quantity: 15 },
      { user_id: 3, share_symbol: 'GHI', quantity: 30 },
      { user_id: 4, share_symbol: 'JKL', quantity: 25 },
      { user_id: 5, share_symbol: 'MNO', quantity: 18 }
    ];

    await queryInterface.bulkInsert('users', userData);
    await queryInterface.bulkInsert('shares', shareData);
    await queryInterface.bulkInsert('trade', tradeData);
    await queryInterface.bulkInsert('portfolio', portfolioData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('portfolio', null, {});
    await queryInterface.bulkDelete('trades', null, {});
    await queryInterface.bulkDelete('shares', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
