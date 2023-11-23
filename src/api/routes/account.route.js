const accountController = require('../controllers/account.controller');

const accountRoute = require('express').Router();

accountRoute.post('/auth/register', accountController.register);
accountRoute.post('/auth/activation', accountController.activation);

module.exports = accountRoute;
