const ApiError = require('../helpers/error');
const { sendRes, sendErr } = require('../helpers/response');
const Account = require('../models/account.model');
const ClassRoom = require('../models/Classroom/classroom.model');

require('dotenv').config();

module.exports = {
  mappingStudent: async (req, res) => {
    const { studentId = '', mapCode = '' } = req.body;

    if (mapCode.length !== 8) {
      return sendErr(res, new ApiError(400, 'Invalid mapCode'));
    }

    if (!studentId) {
      return sendErr(res, new ApiError(400, 'Missing studentId'));
    }

    try {
      const student = await Account.findById(studentId);
      if (!student) {
        return sendErr(res, new ApiError(400, 'Student not found'));
      }

      student.mapCode = mapCode;
      await student.save();

      return sendRes(res, 200, student);
    } catch (error) {
      return sendErr(res, new ApiError(500, error));
    }
  },
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
