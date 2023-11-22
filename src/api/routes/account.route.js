const accountController = require('../controllers/account.controller');

const accountRoute = require('express').Router();

accountRoute.get('/auth/register', accountController.register);

module.exports = accountRoute;
