require('dotenv').config();
const { paginate } = require('../helpers/handler');
const { sendRes, sendErr } = require('../helpers/response');
const ClassRoom = require('../models/Classroom/classroom.model');
const StudentClass = require('../models/Classroom/studentclass.model');
const TeacherClass = require('../models/Classroom/teacherclass.model');
const Account = require('../models/account.model');
const ApiError = require('../helpers/error');
const { sendEmailInvite } = require('../helpers/email');
const { generateInvitationCode } = require('../helpers/invitaioncode');
const ObjectId = require('mongoose').Types.ObjectId;

const logger = (...content) => {
  console.log('[CLASS CONTROLLER] ' + content);
};
const { getIO } = require('../services/socket');

module.exports = {
  createClass: async (req, res, next) => {
    const { name, description } = req.body;

    logger(req.body);
    console.log(req.body);
    if (!name || !description) {
      return sendErr(res, { status: 500, message: 'Missing required params' });
    }
    logger(name, description);

    try {
      const invitationCode = generateInvitationCode();
      const createdClass = new ClassRoom({ name, description, invitationCode });
      await createdClass.save();
      logger(createdClass);
      return sendRes(res, 200, createdClass);
    } catch (error) {
      next(error);
    }
  },

  getClass: async (req, res, next) => {
    const io = getIO();

    logger('getClass');
    let { id, fields } = req.query;
    if (!id) {
      return sendErr(res, { status: 500, message: 'Missing required params' });
    }
    logger(id);
    if (fields) {
      fields = fields.split(',');
    }

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
      const students = await Account.find({ _id: { $in: studentsId } }).select(
        fields ? fields.join(' ') : ''
      );

      console.log(teachers, students);

      sendRes(res, 200, { class: validClass, students, teachers });
    } catch (error) {
      next(error);
    }
  },

  getClasses: async (req, res, next) => {
    const { page = 1, limit = 20, userId } = req.query;

    try {
      if (userId) {
        // @todo: implement here
        // io.to(userId).emit('updated', { message: 'Data has been updated' });

        const account = await Account.findById(userId);

        const teachers = await TeacherClass.find({ teacherId: account.id });
        const students = await StudentClass.find({ studentId: account.id });
        // logger(teachers, students);

        let classIds = [];

        teachers.forEach((teacher) => {
          if (!classIds.includes(teacher.classId)) {
            classIds.push(teacher.classId);
          }
        });

        students.forEach((student) => {
          if (!classIds.includes(student.classId)) {
            classIds.push(student.classId);
          }
        });

        classIds = classIds
          .filter((id) => ObjectId.isValid(id))
          .filter((c) => c);

        const classes = await ClassRoom.find({ _id: { $in: classIds } });
        logger(classes);

        return sendRes(
          res,
          200,
          paginate({ data: classes, page: +page, limit: +limit })
        );
      } else {
        return sendErr(res, {
          status: 500,
          message: 'Invalid userId params',
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // @todo: need to validate teacher Id
  addMember: async (req, res, next) => {
    const { teacherId, studentId, classId, invitationCode } = req.body;

    if ((!teacherId && !studentId) || (!classId && !invitationCode)) {
      return sendErr(res, { status: 500, message: 'Missing required params' });
    }

    // find class in db
    let foundClass;
    if (classId) {
      foundClass = await ClassRoom.findById(classId);
    }

    if (invitationCode) {
      foundClass = await ClassRoom.findOne({ invitationCode });
    }

    if (!foundClass) {
      return sendErr(res, { status: 500, message: 'Class not found' });
    }

    let foundClassId = foundClass._id.toString();

    if (teacherId) {
      // find teacher in DB
      const foundTeacher = await TeacherClass.findOne({
        teacherId,
        classId: foundClassId,
      });
      if (foundTeacher) {
        return sendErr(res, {
          status: 500,
          message: 'Teacher already in class',
        });
      }
      // add teacher to class
      const createdTeacher = new TeacherClass({
        teacherId,
        classId: foundClassId,
      });
      await createdTeacher.save();
      return sendRes(res, 200, createdTeacher);
    } else if (studentId) {
      // find student in DB
      const foundStudent = await StudentClass.findOne({
        studentId,
        classId: foundClassId,
      });
      if (foundStudent) {
        return sendErr(res, {
          status: 500,
          message: 'Student already in class',
        });
      }
      // add student to class
      const createdStudent = new StudentClass({
        studentId,
        classId: foundClassId,
      });
      await createdStudent.save();
      return sendRes(res, 200, createdStudent);
    }
  },
  inviteMember: async (req, res, next) => {
    logger('inviteMember');
    const { classId, teacherEmails, studentEmails } = req.body;
    let accounts = [];
    let newTeachers = [];
    let newStudents = [];
    try {
      // check fields
      if (!classId || !teacherEmails || !studentEmails) {
        return sendErr(res, new ApiError(400, 'Missing fields'));
      }

      console.log(req.body);

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

      for (const email of teacherEmails) {
        const account = await Account.findOne({ email }).lean();
        if (account) {
          logger('case if');
          accounts.push(account);
        } else {
          logger('case else');

          newTeachers.push(email);
        }
      }

      for (const email of studentEmails) {
        const account = await Account.findOne({ email }).lean();
        if (account) {
          logger('case if');
          accounts.push(account);
        } else {
          logger('case else');

          newStudents.push(email);
        }
      }
      console.log('account ', accounts);
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
      console.log('accounts ', accounts);
      console.log(newTeachers, newStudents);

      const newTeacherUrl = `${process.env.CLIENT_URL}register?r=class/add?classId=${classId}&cbRole=teacher`;
      const newStudentUrl = `${process.env.CLIENT_URL}register?r=class/add?classId=${classId}&cbRole=student`;
      newTeachers.forEach((email) => {
        sendEmailInvite(
          email,
          newTeacherUrl,
          'Join Class',
          email,
          foundClass.name
        );
      });

      newStudents.forEach((email) => {
        sendEmailInvite(
          email,
          newStudentUrl,
          'Join Class',
          email,
          foundClass.name
        );
      });

      sendRes(res, 200, undefined, 'Invitations sent successfully.');
    } catch (error) {
      next(error);
    }
  },
};
