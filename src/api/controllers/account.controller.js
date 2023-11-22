const bcrypt = require('bcrypt');

// const Account = require('../models/account.model');
// const { sendEmailRegister, sendEmailReset } = require('../helpers/email');
// const cloudinary = require('../../configs/cloudinary');
// const { sendRes, sendErr } = require('../helpers/response');
// const { accessToken, activationToken } = require('../helpers/token');

const saltRounds = 10;
const baseURL = 'http://localhost:3000';

module.exports = {
    register: (req, res) => {
        res.send('Register api');
    }
};
