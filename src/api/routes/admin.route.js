const adminController = require('../controllers/admin.controller');

const adminRoute = require('express').Router();

adminRoute.get('/accounts', adminController.getAccounts);
adminRoute.get('/classes', adminController.getClasses);

// adminRoute.get('/account/lock');
// adminRoute.get('/account/map');

module.exports = adminRoute;
