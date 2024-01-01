require('dotenv').config();
const Account = require('../models/account.model');
const ClassRoom = require('../models/Classroom/classroom.model');

const ApiError = require('../helpers/error');
const { sendRes, sendErr } = require('../helpers/response');

module.exports = {
  mappingStudent: async (req, res) => {
    const { studentId, mapCode = '' } = req.body;

    if (mapCode.length !== 8) {
      return sendErr(res, new ApiError(400, 'Invalid mapCode'));
    }

    if (!studentId) {
      return sendErr(res, new ApiError(400, 'Missing studentId'));
    }
    try {
      const existedMapcode = await Account.findOne({ mapCode });
      if (existedMapcode) {
        return sendErr(res, new ApiError(400, 'Mapcode already existed'));
      }

      const student = await Account.findById(studentId);
      if (!student) {
        return sendErr(res, new ApiError(400, 'Student not found'));
      }
      if (!student.mapCode || student.mapCode.length !== 8) {
        student.mapCode = mapCode;
        await student.save();
        return sendRes(res, 200, student);
      }
    } catch (error) {
      return sendErr(res, new ApiError(500, error));
    }
  },
  unmapStudent: async (req, res) => {
    const { studentId } = req.body;

    if (!studentId) {
      return sendErr(res, new ApiError(400, 'Missing studentId'));
    }

    try {
      const student = await Account.findById(studentId);
      if (!student) {
        return sendErr(res, new ApiError(400, 'Student not found'));
      }

      const updatedStudent = await Account.findByIdAndUpdate(studentId, {
        $unset: { mapCode: 1 },
      });

      return sendRes(res, 200, updatedStudent);
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
  lockAccount: async (req, res) => {
    const { id } = req.body;
    if (!id) return sendErr(res, new ApiError(400, 'Missing id'));
    try {
      const account = await Account.findById(id);
      if (!account) {
        return sendErr(res, new ApiError(400, 'Account not found'));
      }
      account.isLocked = true;
      await account.save();

      return sendRes(res, 200, account);
    } catch (error) {
      return sendErr(res, new ApiError(500, error));
    }
  },

  unlockAccount: async (req, res) => {
    const { id } = req.body;
    if (!id) return sendErr(res, new ApiError(400, 'Missing id'));
    try {
      const account = await Account.findById(id);
      if (!account) {
        return sendErr(res, new ApiError(400, 'Account not found'));
      }
      if (account.isLocked) {
        account.isLocked = false;
        await account.save();
        return sendRes(res, 200, account);
      }
      return sendErr(res, new ApiError(400, 'Account is not locked'));
    } catch (error) {
      return sendErr(res, new ApiError(500, error));
    }
  },
};
