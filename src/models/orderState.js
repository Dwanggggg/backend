const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connectDB');

const OrderState = sequelize.define('OrderState', {
  orderStateID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderStateName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = OrderState;