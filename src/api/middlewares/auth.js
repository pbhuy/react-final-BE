const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

const passportConfig = require('../../configs/passport');
const { sendErr } = require('../helpers/response');
const ApiError = require('../helpers/error');

const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, account) => {
        if (err) {
            return sendErr(res, new ApiError(401, 'Unauthorized'));
        }
        if (!account) {
            return sendErr(
                res,
                new ApiError(401, 'Access denied! Missing or invalid token.')
            );
        }
        req.id = account.id;
        req.role = account.role;
        return next();
    })(req, res, next);
};

const authorizeUserAccess = (req, res, next) => {
    if (req.user.role === 'user') {
        return next();
    }
    return sendErr(res, new ApiError(403, 'Access denied!'));
};

const adminAccessOnly = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return sendErr(res, new ApiError(403, 'Access denied!'));
};

module.exports = { authenticateJWT, authorizeUserAccess, adminAccessOnly };
