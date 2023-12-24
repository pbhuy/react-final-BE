const adminController = require('../controllers/admin.controller');

const adminRoute = require('express').Router();

adminRoute.get('/accounts', adminController.getAccounts);
adminRoute.get('/classes', adminController.getClasses);
adminRoute.post('/account/map', adminController.mappingStudent);

// adminRoute.get('/account/lock');

module.exports = adminRoute;
