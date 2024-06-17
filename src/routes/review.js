const express = require('express');

const ReviewController = require('../controllers/ReviewController');

let router = express.Router();

router.get('/list/:productID', ReviewController.list);

router.get('/detail/:customerID/:productID', ReviewController.detail);

router.post('/create', ReviewController.create);

router.put('/update', ReviewController.update);

module.exports = router;