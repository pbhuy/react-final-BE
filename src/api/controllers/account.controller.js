const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../models/account.model');
const ApiError = require('../helpers/error');
const { sendEmailRegister, sendEmailReset } = require('../helpers/email');
const cloudinary = require('../../configs/cloudinary');
const { sendRes, sendErr } = require('../helpers/response');
const { accessToken, activationToken } = require('../helpers/token');

const saltRounds = 10;
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
            const url = `${process.env.CLIENT_URL}/auth/active/${activation_token}`;
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
            if (!activation_token)
                return sendErr(
                    res,
                    new ApiError(400, 'Missing or Invalid activate token')
                );
            // decode token
            const { name, email, password } = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET
            );
            // check fields after decode
            if (!name || !email || !password)
                return sendErr(
                    res,
                    new ApiError(400, 'name, email or password is required')
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
            const account = new Account({ name, email, password });
            await account.save();
            sendRes(res, 200, undefined, 'Account has been activated.');
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            // check if email found
            const account = await Account.findOne({ email }).lean();
            if (!account)
                return sendErr(res, new ApiError(400, 'Email not found'));
            // check if password is verified
            const isValid = await bcrypt.compare(password, account.password);
            if (!isValid)
                return sendErr(
                    res,
                    new ApiError(401, 'Email or password is incorrect')
                );
            const access_token = accessToken({
                _id: account._id,
                role: account.role
            });
            account.access_token = access_token;
            sendRes(res, 200, account, 'Login successfully');
        } catch (error) {
            next(error);
        }
    },
    googleLogin: async (req, res, next) => {
        let access_token, account, new_account;
        try {
            if (!req.user) {
                return sendErr(res, new ApiError(403, 'Access denied!'));
            }
            const email = req.user.emails[0].value;
            const foundAccount = await Account.findOne({ email }).lean();
            const name = req.user.displayName;
            const password = email + process.env.GOOGLE_AUTH_CLIENT_ID;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            const avatar = req.user.photos[0].value;
            account = { name, email, password: hashedPassword, avatar };
            // register new account
            if (!foundAccount) {
                new_account = new Account(account);
                await new_account.save();
                access_token = accessToken({
                    _id: new_account._id,
                    role: new_account.role
                });
                new_account.toObject();
                new_account.access_token = access_token;
                return sendRes(res, 200, new_account, 'Login successfully');
            } else {
                // login with exist account
                access_token = accessToken({
                    _id: foundAccount._id,
                    role: foundAccount.role
                });
                foundAccount.access_token = access_token;
                return sendRes(res, 200, foundAccount, 'Login successfully');
            }
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
                        _id: account._id,
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
            const url = `${process.env.CLIENT_URL}/auth/reset-password/${access_token}`;
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
            const account_id = req._id;
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
            const account_id = req._id;
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
