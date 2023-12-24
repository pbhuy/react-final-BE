const ApiError = require('../helpers/error');
const { sendRes, sendErr } = require('../helpers/response');
const Account = require('../models/account.model');
const ClassRoom = require('../models/Classroom/classroom.model');

require('dotenv').config();

module.exports = {
  getClasses: async (req, res) => {
    // pagination
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1 || skip < 0)
      return sendErr(res, new ApiError(400, 'Invalid pagination'));

    const classes = await ClassRoom.find(
      {},
      {
        createdAt: 0,
        updatedAt: 0,
      }
    )
      .skip(skip)
      .limit(limit);
    return sendRes(res, 200, { page, limit, classes });
  },

  getAccounts: async (req, res) => {
    // pagination
    const { page = 1, limit = 10, role = 'student' } = req.query;
    const skip = (page - 1) * limit;

    if (role !== 'student' && role !== 'teacher')
      return sendErr(res, new ApiError(400, 'Invalid role'));

    if (page < 1 || limit < 1 || skip < 0)
      return sendErr(res, new ApiError(400, 'Invalid pagination'));

    const accounts = await Account.find(
      { role },
      {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    )
      .skip(skip)
      .limit(limit);
    return sendRes(res, 200, { page, limit, accounts });
  },
};
