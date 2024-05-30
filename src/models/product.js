const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connectDB');
const Category = require('./category');

const Product = sequelize.define('Product', {
  productID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pictures: DataTypes.STRING,
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  description: DataTypes.TEXT,
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
  
   
  
}, {
  timestamps: false
});

Product.belongsTo(Category, {
    foreignKey: { name: 'categoryID', type: DataTypes.INTEGER, allowNull: false }
  });
  Category.hasMany(Product, {
	foreignKey: { name: 'categoryID', type: DataTypes.INTEGER, allowNull: false }
  });
  module.exports=Product;