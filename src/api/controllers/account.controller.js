const bcrypt = require('bcrypt');

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
            console.log('account', account);
            // create active token
            const activation_token = activationToken(account);
            console.log('active token', activation_token);
            const url = `${baseURL}/auth/active/${activation_token}`;
            sendEmailRegister(email, url, 'Verify your email');
            sendRes(res, 200, undefined, 'Welcome! Please check your email');
        } catch (error) {
            next(error);
        }
    },
    login: (req, res, next) => {}
};
