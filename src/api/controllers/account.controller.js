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
            const refresh_token = refreshToken({
                _id: account._id,
                role: account.role
            });
            const access_token = accessToken({
                _id: account._id,
                role: account.role
            });
            sendRes(
                res,
                200,
                { refresh_token, access_token },
                'Login successfully'
            );
        } catch (error) {
            next(error);
        }
    },
    googleLogin: async (req, res, next) => {
        let refresh_token, access_token;
        try {
            const email = req.profile.emails[0].value;
            const foundAccount = await Account.findOne({ email });
            const name = req.profile.displayName;
            const password = email + process.env.GOOGLE_AUTH_CLIENT_ID;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            const avatar = req.profile.photos[0].value;
            let account = { name, email, password: hashedPassword };
            // register new account
            if (!foundAccount) {
                const new_account = new Account({
                    ...account,
                    avatar
                });
                await new_account.save();
                refresh_token = refreshToken({
                    _id: new_account._id,
                    role: new_account.role
                });
                access_token = accessToken({
                    _id: new_account._id,
                    role: new_account.role
                });
            } else {
                // login with exist account
                refresh_token = refreshToken({
                    _id: foundAccount._id,
                    role: foundAccount.role
                });
                access_token = accessToken({
                    _id: foundAccount._id,
                    role: foundAccount.role
                });
            }
            sendRes(
                res,
                200,
                { refresh_token, access_token },
                'Login successfully'
            );
        } catch (error) {
            next(error);
        }
    },
    facebookLogin: async (req, res, next) => {
        try {
            console.log('controller auth facebook');
            console.log('user', req.data);
        } catch (error) {
            next(error);
        }
    },
    refresh: async (req, res, next) => {
        try {
            const { refresh_token } = req.body;
            if (!refresh_token)
                return sendErr(res, new ApiError(400, 'Please login'));
            jwt.verify(
                refresh_token,
                process.env.REFRESH_SECRET,
                (err, account) => {
                    if (err)
                        return sendErr(res, new ApiError('Please login again'));
                    const access_token = accessToken({
                        _id: account.id,
                        role: account.role
                    });
                    sendRes(res, 200, { access_token });
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
                    message: 'Email not found'
                });
            // create token
            const access_token = accessToken({
                _id: account._id,
                role: account.role
            });
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
    reset: async (req, res, next) => {
        try {
            const account_id = req._id;
            const { password } = req.body;
            // hash password
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            // update
            await Account.findByIdAndUpdate(account_id, {
                password: hashedPassword
            });
            sendRes(res, 200, undefined, 'Password was updated successfully');
        } catch (error) {
            next(error);
        }
    },
    profile: async (req, res, next) => {
        try {
            const account_id = req.id;
            const account_info = await Account.findById(account_id).select(
                '-password'
            );
            sendRes(res, 200, account_info);
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            // get info
            const account_id = req.id;
            const { name, phone, address } = req.body;
            // upload image
            let result;
            if (req.file)
                result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'avatar'
                });
            const new_account = { name, phone, address };
            new_account.avatar = result && result.url;
            // update
            const account = await Account.findByIdAndUpdate(
                account_id,
                new_account,
                {
                    new: true
                }
            ).select('-password');
            sendRes(res, 200, account, 'Update profile successfully');
        } catch (error) {
            next(error);
        }
    }
};
