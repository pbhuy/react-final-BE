const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../models/account.model');
const ApiError = require('../helpers/error');
const { sendEmailRegister, sendEmailReset } = require('../helpers/email');
const cloudinary = require('../../configs/cloudinary');
const { sendRes, sendErr } = require('../helpers/response');
const {
    accessToken,
    activationToken,
    refreshToken
} = require('../helpers/token');

const saltRounds = 10;
const baseURL = 'http://localhost:3000';

module.exports = {
    register: async (req, res, next) => {
        try {
            // get form registration
            const { name, email, password } = req.body;
            // check account
            const foundEmailAccount = await Account.findOne({ email });
            if (foundEmailAccount)
                return sendErr(
                    res,
                    new ApiError(409, 'Email or phone is already in use')
                );
            // hash password
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            const account = {
                name,
                email,
                password: hashedPassword
            };
            // create activation token
            const activation_token = activationToken(account);
            const url = `${baseURL}/auth/active/${activation_token}`;
            sendEmailRegister(email, url, 'Verify your email');
            sendRes(res, 200, undefined, 'Welcome! Please check your email');
        } catch (error) {
            next(error);
        }
    },
    activation: async (req, res, next) => {
        try {
            // get activate token
            const { activation_token } = req.body;
            // decode token
            const account = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET
            );
            // check account
            const foundAccount = await Account.findOne({
                email: account.email
            });
            if (foundAccount)
                return sendErr(
                    res,
                    new ApiError(409, 'Email is already registered')
                );
            const newAccount = new Account(account);
            await newAccount.save();
            sendRes(res, 200, undefined, 'Account has been activated.');
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            // check if email found
            const account = await Account.findOne({ email });
            if (!account)
                return sendErr(res, new ApiError(400, 'Email not found'));
            // check if password is verified
            const isValid = await bcrypt.compare(password, account.password);
            if (!isValid)
                return sendErr(
                    res,
                    new ApiError(401, 'Email or password is incorrect')
                );
            const refresh_token = refreshToken(account);
            res.cookie('_apprftoken', refresh_token, {
                httpOnly: true,
                path: '/api/accounts/auth/access',
                maxAge: 24 * 60 * 60 * 1000 // 24hrs
            });
            sendRes(res, 200, undefined, 'Login successfully');
        } catch (error) {
            next(error);
        }
    },
    access: async (req, res, next) => {
        try {
            const refresh_token = req.cookies._apprftoken;
            if (!refresh_token)
                return sendErr(res, new ApiError(400, 'Please login'));
            jwt.verify(
                refresh_token,
                process.env.REFRESH_SECRET,
                (err, account) => {
                    if (err)
                        return sendErr(res, new ApiError('Please login again'));
                    const access_token = accessToken(account);
                    sendRes(res, 200, access_token);
                }
            );
        } catch (error) {
            next(error);
        }
    },
    forgot: async (req, res, next) => {
        try {
            const { email } = req.body;
            // check account
            const account = await Account.findOne({ email });
            if (!account)
                return sendErr(res, {
                    status: 400,
                    message: 'Email  not found'
                });
            // create token
            const access_token = accessToken(account);
            // send email
            const url = `${baseURL}/auth/reset-password/${access_token}`;
            sendEmailReset(email, url, 'Reset your password', account.name);
            sendRes(
                res,
                200,
                undefined,
                'Re-send the password, please check your email'
            );
        } catch (error) {
            next(error);
        }
    },
    reset: async (req, res, next) => {}
};
