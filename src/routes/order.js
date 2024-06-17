const express = require('express');

const OrderController = require('../controllers/OrderController');

let router = express.Router()


router.post('/create', OrderController.create);
router.put('/updateOrderState/:orderID',OrderController.updateOrderState)
router.get('/admin/list', OrderController.listAdminSide);
router.get('/customer/list/:customerID', OrderController.listCustomerSide);
router.get('/detail/:customerID/:orderID', OrderController.detailCustomerSide);
router.get('/admin/detail/:orderID', OrderController.detailAdminSide);


module.exports = router;