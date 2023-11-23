const accountController = require('../controllers/account.controller');

const accountRoute = require('express').Router();

accountRoute.post('/auth/register', accountController.register);
accountRoute.post('/auth/activation', accountController.activation);
accountRoute.post('/auth/login', accountController.login);
accountRoute.post('/auth/access', accountController.access);
accountRoute.post('/auth/forgot', accountController.forgot);

module.exports = accountRoute;
