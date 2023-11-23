const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../models/account.model');
const ApiError = require('../helpers/error');
const { sendEmailRegister, sendEmailReset } = require('../helpers/email');
const cloudinary = require('../../configs/cloudinary');
const { sendRes, sendErr } = require('../helpers/response');
const { accessToken, activationToken } = require('../helpers/token');

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
    login: (req, res, next) => {}
};
