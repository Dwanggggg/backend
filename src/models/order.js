const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connectDB');

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
  },
  orderState: {
    type: DataTypes.STRING, // Hoặc DataTypes.ENUM('Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Đã giao hàng', 'Đã hủy')
    allowNull: false,
    defaultValue: 'Chờ xác nhận' // Trạng thái mặc định khi tạo đơn hàng
},
  totalProductValue: { type: DataTypes.INTEGER, allowNull: false },
	deliveryCharges: { type: DataTypes.INTEGER, allowNull: false },
	totalOrderValue: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: false
});


Order.belongsTo(User, {
    foreignKey: { name: 'userID', type: DataTypes.INTEGER, allowNull: false  }
});
User.hasMany(Order, {
    foreignKey: { name: 'userID', type: DataTypes.INTEGER, allowNull: false  }
});
module.exports = Order;