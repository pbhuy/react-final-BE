require('dotenv').config();
const bcrypt = require('bcrypt');
const Account = require('../models/account.model');
const ClassRoom = require('../models/Classroom/classroom.model');

const ApiError = require('../helpers/error');
const { sendRes, sendErr } = require('../helpers/response');
const { generateInvitationCode } = require('../helpers/invitaioncode');

module.exports = {
  createAccount: async (req, res) => {
    const { email, password, role, name, secretCode } = req.body;
    console.log(req.body);
    if (!email || !password || !role || !name) {
      return sendErr(
        res,
        new ApiError(400, 'Missing email or password or role')
      );
    }

    if (!secretCode || secretCode !== process.env.SECRET_ADMIN_CODE) {
      return sendErr(res, new ApiError(400, 'Invalid secret code'));
    }

    if (role !== 'admin')
      return sendErr(res, new ApiError(400, 'Invalid role'));

    const foundAccount = await Account.findOne({ email });

    if (foundAccount)
      return sendErr(res, new ApiError(409, 'Email is already registered'));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const account = new Account({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await account.save();
    sendRes(res, 200, 'Admin account been activated.');
  },
  mappingStudents: async (req, res) => {
    let { students } = req.body;

    if (!students) {
      return sendErr(res, new ApiError(400, 'Missing students'));
    }
    console.log('students before filter', students);

    students = students.filter(
      (student) =>
        student._id &&
        student.mapCode &&
        student.mapCode.toString().length === 8
    );
    console.log('students after filter', students);
    const results = [];

    for (const student of students) {
      console.log(student);
      const validStudent = await Account.findById(student._id);
      if (!validStudent) {
        return sendErr(res, new ApiError(400, 'Student not found'));
      }
      // update new mapcode
      const updated = await Account.findByIdAndUpdate(
        student._id,
        {
          mapCode: student.mapCode,
        },
        { new: true }
      );
      console.log('updated ', updated);
      results.push(updated);
    }

    return sendRes(res, 200, {
      results,
      totalSuccess: results.length,
      totalFailed: students.length - results.length,
    });
  },
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
    let { filter, sort } = req.query;

    if (filter) {
      filter = JSON.parse(filter);
      const orConditions = [];

      if (filter.name) {
        orConditions.push({ name: new RegExp(filter.name, 'i') });
        orConditions.push({ description: new RegExp(filter.name, 'i') });
      }

      if (orConditions.length > 0) {
        filter.$or = orConditions;
        delete filter.name; // Remove individual field conditions
      }
    }

    if (sort) {
      sort = JSON.parse(sort);
    }

    console.log(req.query);

    const skip = (page - 1) * limit;
    const total = await ClassRoom.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    if (page < 1 || limit < 1 || skip < 0)
      return sendErr(res, new ApiError(400, 'Invalid pagination'));

    const classes = await ClassRoom.find(filter, {
      createdAt: 0,
      updatedAt: 0,
    })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return sendRes(res, 200, { page, limit, total, pages, classes });
  },
  getAccounts: async (req, res) => {
    // pagination
    const { page = 1, limit = 10, role = 'student' } = req.query;
    const skip = (page - 1) * limit;

    if (role !== 'student' && role !== 'teacher')
      return sendErr(res, new ApiError(400, 'Invalid role'));

    if (page < 1 || limit < 1 || skip < 0)
      return sendErr(res, new ApiError(400, 'Invalid pagination'));
    const total = await Account.countDocuments({ role });
    const pages = Math.ceil(total / limit);

    const accounts = await Account.find(
      { role },
      {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    ).skip(skip);
    return sendRes(res, 200, { page, pages, limit, accounts });
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
  createInvitationCode: async (req, res) => {
    const { classId } = req.body;
    if (!classId) return sendErr(res, new ApiError(400, 'Missing classId'));
    try {
      const existedClass = await ClassRoom.findById(classId);
      if (!existedClass) {
        return sendErr(res, new ApiError(400, 'Class not found'));
      }
      const existedInvitationCode = await ClassRoom.findOne({
        invitationCode: existedClass.invitationCode,
      });
      if (existedInvitationCode) {
        return sendErr(res, new ApiError(400, 'Invitation code already exist'));
      }

      const invitationCode = generateInvitationCode();
      const updated = await ClassRoom.findByIdAndUpdate(classId, {
        invitationCode,
      });

      return sendRes(res, 200, updated);
    } catch (error) {
      return sendErr(res, new ApiError(500, error));
    }
  },
  removeInvitationCode: async (req, res) => {
    const { classId } = req.body;
    if (!classId) return sendErr(res, new ApiError(400, 'Missing classId'));
    try {
      const existedClass = await ClassRoom.findById(classId);
      if (!existedClass) {
        return sendErr(res, new ApiError(400, 'Class not found'));
      }
      if (!existedClass.invitationCode) {
        return sendErr(res, new ApiError(400, 'Class has no invitation code'));
      }

      const updated = await ClassRoom.findByIdAndUpdate(classId, {
        $unset: { invitationCode: 1 },
      });

      return sendRes(res, 200, updated);
    } catch (error) {
      return sendErr(res, new ApiError(500, error));
    }
  },
  inactiveClass: async (req, res) => {
    const { classId } = req.body;
    if (!classId) return sendErr(res, new ApiError(400, 'Missing classId'));
    try {
      const existedClass = await ClassRoom.findById(classId);
      if (!existedClass) {
        return sendErr(res, new ApiError(400, 'Class not found'));
      }
      if (!existedClass.isActived) {
        return sendErr(res, new ApiError(400, 'Class is already inactive'));
      }

      const updated = await ClassRoom.findByIdAndUpdate(classId, {
        $set: { isActived: false },
      });

      return sendRes(res, 200, updated);
    } catch (error) {
      return sendErr(res, new ApiError(500, error));
    }
  },

  activeClass: async (req, res) => {
    const { classId } = req.body;
    if (!classId) return sendErr(res, new ApiError(400, 'Missing classId'));
    try {
      const existedClass = await ClassRoom.findById(classId);
      if (!existedClass) {
        return sendErr(res, new ApiError(400, 'Class not found'));
      }
      if (existedClass.isActived) {
        return sendErr(res, new ApiError(400, 'Class is already active'));
      }

      const updated = await ClassRoom.findByIdAndUpdate(classId, {
        $set: { isActived: true },
      });

      return sendRes(res, 200, updated);
    } catch (error) {
      return sendErr(res, new ApiError(500, error));
    }
  },
};
