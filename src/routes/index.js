import express from "express";

const adminRouter = require('./admin');

const customerRouter = require('./customer');
let setRoute = (app) => {

app.use('/api/admin',adminRouter);
    app.use('/api/customer',customerRouter)
   
}

module.exports = setRoute;