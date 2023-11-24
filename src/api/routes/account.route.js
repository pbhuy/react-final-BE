const accountController = require('../controllers/account.controller');
const { authenticateJWT } = require('../middlewares/auth');
const uploader = require('../middlewares/uploader');

const accountRoute = require('express').Router();

accountRoute.post('/auth/register', accountController.register);
accountRoute.post('/auth/activation', accountController.activation);
accountRoute.post('/auth/login', accountController.login);
accountRoute.post('/auth/access', accountController.access);
accountRoute.post('/auth/forgot', accountController.forgot);
accountRoute.post('/auth/reset', authenticateJWT, accountController.reset);
accountRoute.get('/auth/profile', authenticateJWT, accountController.profile);
accountRoute.patch(
    '/auth/update',
    authenticateJWT,
    uploader.single('avatar'),
    accountController.update
);

module.exports = accountRoute;
