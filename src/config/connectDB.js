const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');




const sequelize = new Sequelize('prj', 'root', '123456po', {
  host: 'localhost',
  dialect: 'mysql'
});
const connectDB = async() =>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
module.exports = {sequelize,
    connectDB};