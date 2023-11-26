require('dotenv').config();
const accountController = require('../controllers/account.controller');
const {
    authenticateJWT,
    authFacebook,
    authGoogle
} = require('../middlewares/auth');
const passport = require('passport');
const uploader = require('../middlewares/uploader');
const { sendErr } = require('../helpers/response');
const ApiError = require('../helpers/error');

const accountRoute = require('express').Router();

accountRoute.post('/auth/register', accountController.register);
accountRoute.post('/auth/activation', accountController.activation);
accountRoute.post('/auth/login', accountController.login);

/* Google Auth */
accountRoute.get('/auth/login/failed', (req, res) => {
    return sendErr(res, new ApiError(401, 'Unauthorized'));
});
accountRoute.get('/auth/login/success', accountController.googleLogin);
accountRoute.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
accountRoute.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/login/failed',
        successRedirect: process.env.CLIENT_URL,
        session: false
    })
);
/* Facebook Auth */
accountRoute.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);
accountRoute.get(
    '/auth/facebook/callback',
    authFacebook,
    accountController.facebookLogin
);

accountRoute.post('/auth/refresh', accountController.refresh);
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
