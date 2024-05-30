import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import setRoute from './routes/index';
import { sequelize, connectDB } from './config/connectDB';
import { Sequelize } from 'sequelize';
const { createRecordsDefault } = require('./config/createRecordsDefault');

const User = require('./models/user');

const CustomerInfo = require('./models/customerInfo');
const Role = require('./models/role');
const Category = require('./models/category');
const Product = require('./models/product');
const Order = require('./models/order');
const OrderState = require('./models/orderState');
const OrderDetail = require('./models/orderDetail');
const Review = require('./models/review');

let app = express();
let port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

setRoute(app);

(async () => {
  await connectDB();
  await createRecordsDefault();
  sequelize.sync({})  // Dùng force: true để xóa và tạo lại bảng
    .then(async() => {
      console.log('Database synchronization successful.');
      
     
    })
    .catch(err => {
      console.error('Unable to synchronize with the database:', err);
    });
})();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
