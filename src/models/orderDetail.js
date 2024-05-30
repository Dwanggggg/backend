const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connectDB');
const Product = require('./product');
const Order =require('./order');
const OrderDetail = sequelize.define('OrderDetail', {
  orderDetailID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: false
});

OrderDetail.belongsTo(Product, {
    foreignKey: { name: 'ProductID', type: DataTypes.INTEGER, allowNull: false }
});
Product.hasMany(OrderDetail, {
    foreignKey: { name: 'ProductID', type: DataTypes.INTEGER, allowNull: false }
});
OrderDetail.belongsTo(Order, {
    foreignKey: { name: 'orderID', type: DataTypes.INTEGER, allowNull: false  }
});
Order.hasMany(OrderDetail, {
    foreignKey: { name: 'orderID', type: DataTypes.INTEGER, allowNull: false  }
});
module.exports = OrderDetail;