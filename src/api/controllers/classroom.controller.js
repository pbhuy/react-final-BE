require('dotenv').config();
const { paginate } = require('../helpers/handler');
const { sendRes, sendErr } = require('../helpers/response');
const ClassRoom = require('../models/Classroom/classroom.model');
const StudentClass = require('../models/Classroom/studentclass.model');
const TeacherClass = require('../models/Classroom/teacherclass.model');
const Account = require('../models/account.model');
const ApiError = require('../helpers/error');
const { sendEmailInvite } = require('../helpers/email');

const logger = (...content) => {
  console.log('[CLASS CONTROLLER] ' + content);
};

module.exports = {
  createClass: async (req, res, next) => {
    const { name, description } = req.body;

    if (!name || !description) {
      return sendErr(res, { status: 500, message: 'Missing required params' });
    }
    logger(name, description);

    try {
      const createdClass = new ClassRoom({ name, description });
      await createdClass.save();
      return sendRes(res, 200, createdClass);
    } catch (error) {
      next(error);
    }
  },

  getClass: async (req, res, next) => {
    logger('getClass');
    const { id } = req.query;
    if (!id) {
      return sendErr(res, { status: 500, message: 'Missing required params' });
    }
    logger(id);

    try {
      const validClass = await ClassRoom.findById(id);

      if (!validClass) {
        return sendErr(res, { status: 500, message: 'Class not found' });
      }

      const studentsInClass = await StudentClass.find({ classId: id });
      const teachersInClass = await TeacherClass.find({ classId: id });

      const studentsId = studentsInClass.map((student) => student.studentId);
      const teachersId = teachersInClass.map((teacher) => teacher.teacherId);

      const teachers = await Account.find({ _id: { $in: teachersId } });
      const students = await Account.find({ _id: { $in: studentsId } });

      console.log(teachers, students);

      sendRes(res, 200, { class: validClass, students, teachers });
    } catch (error) {
      next(error);
    }
  },

  getClasses: async (req, res, next) => {
    const { page = 1, limit = 20 } = req.query;
    try {
      const classes = await ClassRoom.find({});
      logger(classes);
      if (!classes) {
        return sendErr(res, { status: 500, message: 'Classes not found' });
      }
      logger(page, limit);
      return sendRes(
        res,
        200,
        paginate({ data: classes, page: +page, limit: +limit })
      );
    } catch (error) {
      next(error);
    }
  },

  // @todo: need to validate teacher Id
  addMember: async (req, res, next) => {
    const { teacherId, studentId, classId } = req.body;

    if ((!teacherId && !studentId) || !classId) {
      return sendErr(res, { status: 500, message: 'Missing required params' });
    }

    if (teacherId) {
      const foundTeacher = await TeacherClass.findOne({ teacherId, classId });
      if (foundTeacher) {
        return sendErr(res, {
          status: 500,
          message: 'Teacher already in class'
        });
      }
      const createdTeacher = new TeacherClass({ teacherId, classId });
      await createdTeacher.save();
      return sendRes(res, 200, createdTeacher);
    } else if (studentId) {
      const foundStudent = await StudentClass.findOne({ studentId, classId });

      if (foundStudent) {
        return sendErr(res, {
          status: 500,
          message: 'Student already in class'
        });
      }

      const createdStudent = new StudentClass({ studentId, classId });
      await createdStudent.save();
      return sendRes(res, 200, createdStudent);
    }
  },
  inviteMember: async (req, res, next) => {
    const { classId, teacherEmails, studentEmails } = req.body;
    let accounts = [];
    try {
      // check fields
      if (!classId || !teacherEmails || !studentEmails) {
        return sendErr(res, new ApiError(400, 'Missing fields'));
      }
      // check emails list
      if (teacherEmails.length === 0 && studentEmails.length === 0)
        return sendErr(
          res,
          new ApiError(
            400,
            'Please provide at least one teacher or one student email.'
          )
        );
      // check class exist
      const foundClass = await ClassRoom.findById(classId);
      if (!foundClass)
        return sendErr(res, new ApiError(404, 'Class not found'));
      const emails = [...teacherEmails, ...studentEmails];
      for (const email of emails) {
        const account = await Account.findOne({ email: email }).lean();
        accounts.push(account);
      }
      const url = `${process.env.CLIENT_URL}class/add?classId=${classId}`;
      accounts.forEach((account) => {
        sendEmailInvite(
          account.email,
          url,
          'Join Class',
          account.name,
          foundClass.name
        );
      });
      sendRes(res, 200, undefined, 'Invitations sent successfully.');
    } catch (error) {
      next(error);
    }
  }
};
