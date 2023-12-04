const { paginate } = require("../helpers/handler");
const { sendRes, sendErr } = require("../helpers/response");
const ClassRoom = require("../models/Classroom/classroom.model");
const StudentClass = require("../models/Classroom/studentclass.model");
const TeacherClass = require("../models/Classroom/teacherclass.model");
const Account = require("../models/account.model");

const logger = (...content) => {
  console.log("[CLASS CONTROLLER] " + content);
};

module.exports = {
  createClass: async (req, res, next) => {
    const { name, description } = req.body;

    if (!name || !description) {
      return sendErr(res, { status: 500, message: "Missing required params" });
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
    logger("getClass");
    const { id } = req.query;
    if (!id) {
      return sendErr(res, { status: 500, message: "Missing required params" });
    }
    logger(id);

    try {
      const validClass = await ClassRoom.findById(id);

      if (!validClass) {
        return sendErr(res, { status: 500, message: "Class not found" });
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
        return sendErr(res, { status: 500, message: "Classes not found" });
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
      return sendErr(res, { status: 500, message: "Missing required params" });
    }

    if (teacherId) {
      const foundTeacher = await TeacherClass.findOne({ teacherId, classId });
      if (foundTeacher) {
        return sendErr(res, {
          status: 500,
          message: "Teacher already in class",
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
          message: "Student already in class",
        });
      }

      const createdStudent = new StudentClass({ studentId, classId });
      await createdStudent.save();
      return sendRes(res, 200, createdStudent);
    }
  },
};
