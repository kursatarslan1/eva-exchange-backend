// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database_config');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cash: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0.0
    }
}, {
    tableName: 'users',
    timestamps: false
});

User.GetUserById = async function(user_id) {
    try {
        return await User.findByPk(user_id);
    } catch (error) {
        console.log('Error getting user by id: ', error);
        return null;
    }
};

User.GetBalanceByUserId = async function(user_id) {
    try {
        const user = await User.findByPk(user_id, {
            attributes: ['cash']
        });
        return user ? user.cash : null;
    } catch (error) {
        console.log('Error getting balance by user id: ', error);
        return null;
    }
};

module.exports = User;
