const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connectDB');
const OrderState = require('./orderState');
const User = require('./user');
const Order = sequelize.define('Order', {
  orderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});
Order.belongsTo(OrderState, {
    foreignKey: { name: 'orderStateID', type: DataTypes.INTEGER, allowNull: false  }
});
OrderState.hasMany(Order, {
    foreignKey: { name: 'orderStateID', type: DataTypes.INTEGER, allowNull: false  }
});
Order.belongsTo(User, {
    foreignKey: { name: 'userID', type: DataTypes.INTEGER, allowNull: false  }
});
User.hasMany(Order, {
    foreignKey: { name: 'userID', type: DataTypes.INTEGER, allowNull: false  }
});
module.exports = Order;