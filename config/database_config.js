const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('eva-exchange', 'postgres', 'R_esidenT1.2460!', {
    host: '89.252.184.44',
    dialect: 'postgres',
    port: 5432,
    logging: false 
});

module.exports = sequelize;
