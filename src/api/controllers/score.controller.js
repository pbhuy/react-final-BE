const { sendRes, sendErr } = require('../helpers/response');
const ApiError = require('../helpers/error');

const Type = require('../models/Scores/type.model');
const Score = require('../models/Scores/score.model');
const Request = require('../models/Scores/request.model');
const Comment = require('../models/Scores/comment.model');
const Notification = require('../models/notification.model');
const { sendNotification } = require('./notification.controller');
const Account = require('../models/account.model');
const StudentClass = require('../models/Classroom/studentclass.model');

module.exports = {
  updateScores: async (req, res, next) => {
    let { listScores } = req.body;

    if (!listScores) {
      return sendErr(res, new ApiError(400, 'Missing listScores'));
    }

    listScores = listScores.filter(
      (score) => score.id && score.value && score.value > 0
    );

    const results = [];

    for (const score of listScores) {
      const validScore = await Score.findById(score.id);
      if (!validScore) {
        return sendErr(res, new ApiError(400, 'ScoreId not found'));
      }
      // update new mapcode
      const updated = await Score.findByIdAndUpdate(
        score.id,
        {
          value: score.value,
        },
        { new: true }
      );
      console.log('updated ', updated);
      results.push(updated);
    }

    return sendRes(res, 200, {
      results,
      totalSuccess: results.length,
      totalFailed: listScores.length - results.length,
    });
  },
  // Type controllers
  getTypes: async (req, res, next) => {
    try {
      const types = await Type.find().populate({
        path: 'class',
        select: 'name description',
      });
      sendRes(res, 200, types);
    } catch (error) {
      next(error);
    }
  },
  getTypeByClassId: async (req, res, next) => {
    try {
      const { classId } = req.query;
      const types = await Type.find({ class: classId }).populate({
        path: 'class',
        select: 'name description',
      });
      sendRes(res, 200, types);
    } catch (error) {
      next(error);
    }
  },
  createType: async (req, res, next) => {
    try {
      const { name, percentage, classId } = req.body;
      if (!name || !classId) return next(new ApiError(404, 'Missing field'));
      const type = new Type({ name, percentage, class: classId });
      await type.save();
      sendRes(res, 200, type);
    } catch (error) {
      next(error);
    }
  },
  updateType: async (req, res, next) => {
    try {
      const { name, percentage, typeId, isPublish } = req.body;
      let result;
      if (!typeId || (!name && !percentage && !isPublish))
        return next(new ApiError(404, 'Missing field'));
      if (name && percentage)
        result = await Type.findByIdAndUpdate(
          typeId,
          { name, percentage },
          { returnDocument: 'after' }
        );
      else if (percentage)
        result = await Type.findByIdAndUpdate(
          typeId,
          { percentage },
          { returnDocument: 'after' }
        );
      else if (name)
        result = await Type.findByIdAndUpdate(
          typeId,
          { name },
          { returnDocument: 'after' }
        );
      else if (isPublish) {
        result = await Type.findByIdAndUpdate(
          typeId,
          { isPublish },
          { returnDocument: 'after' }
        );

        const scoreType = await Type.findById(result._id.toString()).populate({
          path: 'class',
          select: 'name',
        });

        const studentsInClass = await StudentClass.find({
          classId: scoreType.class._id.toString(),
        });
        const studentsId = studentsInClass.map((student) => student.studentId);

        const notification = new Notification({
          receiver: scoreType.class._id.toString(),
          type: 'publish',
          scoreType: scoreType._id.toString(),
        });
        await notification.save();

        sendNotification({
          receiver: studentsId,
          type: 'publish',
          scoreType,
        });

        //send notif to all students in class
      }
      sendRes(res, 200, result);
    } catch (error) {
      next(error);
    }
  },
  deleteType: async (req, res, next) => {
    try {
      const { typeId } = req.body;
      if (!typeId) return next(new ApiError(404, 'Missing field'));
      await Type.findByIdAndDelete(typeId);
      sendRes(res, 204);
    } catch (error) {
      next(error);
    }
  },

  // Score controllers
  getScores: async (req, res, next) => {
    try {
      const scores = await Score.find()
        .populate({
          path: 'student teacher type',
          select: 'name',
        })
        .populate({
          path: 'type',
          select: 'name percentage',
          populate: {
            path: 'class',
            select: 'name',
          },
        });
      sendRes(res, 200, scores);
    } catch (error) {
      next(error);
    }
  },
  getScoresFinal: async (req, res, next) => {
    try {
      const { classId } = req.query;
      const types = await Type.find({ class: classId });
      const scores = await Score.find({ type: { $in: types } })
        .populate({
          path: 'student teacher',
          select: 'name',
        })
        .populate({
          path: 'type',
          select: 'name percentage',
          populate: {
            path: 'class',
            select: 'name',
          },
        });
      const finalScore = scores.reduce((result, score) => {
        const { teacher, student, type, value } = score;

        let teacherEntry = result.find((entry) => entry.teacher === teacher);
        if (!teacherEntry) {
          teacherEntry = { teacher, scoreBoard: [] };
          result.push(teacherEntry);
        }

        let studentEntry = teacherEntry.scoreBoard.find(
          (entry) => entry.student === student
        );
        if (!studentEntry) {
          studentEntry = {
            student,
            scores: [],
          };
          teacherEntry.scoreBoard.push(studentEntry);
        }

        studentEntry.scores.push({
          typeId: type._id,
          type: type.name,
          percentage: type.percentage,
          scoreId: score._id,
          value,
        });

        return result;
      }, []);
      sendRes(res, 200, finalScore);
    } catch (error) {
      next(error);
    }
  },
  getScoreByClassId: async (req, res, next) => {
    try {
      const { classId } = req.query;
      let scores = await Score.find()
        .populate({
          path: 'student teacher',
          select: 'name',
        })
        .populate({
          path: 'type',
          select: 'name percentage',
          populate: {
            path: 'class',
            select: 'name',
          },
        })
        .lean();
      let result = [];
      scores
        .filter((score) => score.type && score.type.class)
        .forEach(function (score) {
          if (score.type.class._id.toString() === classId) result.push(score);
        });
      sendRes(res, 200, result);
    } catch (error) {
      next(error);
    }
  },
  getScoreByStudentId: async (req, res, next) => {
    try {
      const { studentId } = req.query;
      const scores = await Score.find({ student: studentId })
        .populate({
          path: 'student teacher',
          select: 'name',
        })
        .populate({
          path: 'type',
          select: 'name percentage isPublish',
          populate: {
            path: 'class',
            select: 'name',
          },
        })
        .lean();
      const filteredScores = scores.filter(
        (score) => score.type && score.type.isPublish
      );
      sendRes(res, 200, filteredScores);
    } catch (error) {
      next(error);
    }
  },
  createScore: async (req, res, next) => {
    try {
      const { studentId, teacherId, typeId, value } = req.body;
      if (!studentId || !teacherId || !typeId || !value)
        return next(new ApiError(404, 'Missing field'));
      const score = new Score({
        student: studentId,
        teacher: teacherId,
        type: typeId,
        value,
      });
      await score.save();
      sendRes(res, 200, score);
    } catch (error) {
      next(error);
    }
  },
  createScores: async (req, res, next) => {
    try {
      console.log(req.body);
      const { studentId, teacherId, scores = [] } = req.body;
      if (!studentId || !teacherId || !scores.length)
        return next(new ApiError(404, 'Missing field'));

      const status = [];
      scores.forEach(async (score) => {
        const { typeId, value } = score;
        const newScore = new Score({
          student: studentId,
          teacher: teacherId,
          type: typeId,
          value,
        });
        status.push(newScore.save());
      });

      const score = await Promise.all(status);
      sendRes(res, 200, score);
    } catch (error) {
      next(error);
    }
  },
  rejectRequest: async (req, res, next) => {
    try {
      const { requestId } = req.body;
      if (!requestId) return next(new ApiError(404, 'Missing field'));
      const updated = await Request.findByIdAndUpdate(
        requestId,
        { isActive: false, isApprove: false },
        { returnDocument: 'after' }
      );

      const request = await Request.findById(requestId).populate({
        path: 'student teacher',
        select: 'name',
      });

      const notification = new Notification({
        request: updated._id.toString(),
        receiver: request.student._id.toString(),
        type: 'reject',
      });
      await notification.save();

      sendNotification({
        receiver: request.student._id.toString(),
        type: 'reject',
        sender: request.teacher,
      });

      sendRes(res, 200, updated);
    } catch (error) {
      next(error);
    }
  },
  updateScore: async (req, res, next) => {
    try {
      const { studentId, teacherId, scoreId, value, requestId } = req.body;
      if (!studentId || !teacherId || !scoreId || !value)
        return next(new ApiError(404, 'Missing field'));
      const score = await Score.findByIdAndUpdate(
        scoreId,
        { value },
        { returnDocument: 'after' }
      );
      await Request.findByIdAndUpdate(
        requestId,
        { isActive: false, isApprove: true },
        { returnDocument: 'after' }
      );

      const request = await Request.findById(requestId).populate({
        path: 'student teacher',
        select: 'name',
      });

      const notification = new Notification({
        request: requestId,
        receiver: request.student._id.toString(),
        type: 'approve',
      });
      await notification.save();

      sendNotification({
        receiver: request.student._id.toString(),
        type: 'approve',
        sender: request.teacher,
      });

      sendRes(res, 200, score);
    } catch (error) {
      next(error);
    }
  },
  deleteScore: async (req, res, next) => {
    try {
      const { scoreId } = req.body;
      if (!scoreId) return next(new ApiError(404, 'Missing field'));
      await Score.findByIdAndDelete(scoreId);
      sendRes(res, 204);
    } catch (error) {
      next(error);
    }
  },

  // Request controllers
  getRequests: async (req, res, next) => {
    try {
      const requests = await Request.find()
        .populate({
          path: 'student teacher class',
          select: 'name',
        })
        .populate({
          path: 'comments',
          select: 'content',
          populate: {
            path: 'account',
            model: 'Account',
            select: 'name',
          },
        });
      sendRes(res, 200, requests);
    } catch (error) {
      next(error);
    }
  },
  getRequestById: async (req, res, next) => {
    try {
      const { requestId } = req.query;
      if (!requestId) return next(new ApiError(404, 'Missing field'));
      const request = await Request.findById(requestId)
        .populate({
          path: 'student teacher class',
          select: 'name',
        })
        .populate({
          path: 'comments',
          select: 'content',
          populate: {
            path: 'account',
            model: 'Account',
            select: 'name',
          },
        });
      sendRes(res, 200, request);
    } catch (error) {
      next(error);
    }
  },
  getRequestsByClassId: async (req, res, next) => {
    try {
      const { classId } = req.query;
      const requests = await Request.find({ class: classId })
        .populate({
          path: 'student teacher class',
          select: 'name',
        })
        .populate({
          path: 'comments',
          select: 'content',
          populate: {
            path: 'account',
            model: 'Account',
            select: 'name',
          },
        })
        .populate({
          path: 'score',
          select: 'value',
        });
      const filtered = requests.filter((request) => request.isActive);
      sendRes(res, 200, filtered);
    } catch (error) {
      next(error);
    }
  },
  createRequest: async (req, res, next) => {
    try {
      const {
        title,
        explain,
        actualScore,
        expectedScore,
        studentId,
        teacherId,
        classId,
        scoreId,
      } = req.body;
      if (
        !title ||
        !explain ||
        !studentId ||
        !teacherId ||
        !classId ||
        !actualScore ||
        !expectedScore ||
        !scoreId
      )
        return next(new ApiError(404, 'Missing field'));
      const request = new Request({
        title,
        explain,
        actualScore,
        expectedScore,
        student: studentId,
        teacher: teacherId,
        class: classId,
        score: scoreId,
      });
      const saved = await request.save();

      const notification = new Notification({
        request: saved._id.toString(),
        receiver: teacherId,
        type: 'create',
      });
      await notification.save();
      const student = await Account.findById(studentId).select('name');

      sendNotification({
        receiver: teacherId,
        type: 'create_review',
        sender: student,
      });
      sendRes(res, 201, request);
    } catch (error) {
      next(error);
    }
  },
  updateRequest: async (req, res, next) => {
    try {
      const { requestId } = req.query;
      if (!requestId) return next(new ApiError(404, 'Missing field'));
      const {
        title,
        explain,
        actualScore,
        expectedScore,
        studentId,
        teacherId,
        classId,
      } = req.body;
      if (!studentId || !teacherId || !classId)
        return next(new ApiError(404, 'Missing field'));
      const updateFields = {
        title,
        explain,
        actualScore,
        expectedScore,
        student: studentId,
        teacher: teacherId,
        class: classId,
      };
      // Remove undefined fields
      Object.keys(updateFields).forEach((key) => {
        if (updateFields[key] === undefined) {
          delete updateFields[key];
        }
      });
      const request = await Request.findByIdAndUpdate(requestId, updateFields, {
        returnDocument: 'after',
      });
      sendRes(res, 200, request);
    } catch (error) {
      next(error);
    }
  },
  deleteRequest: async (req, res, next) => {
    try {
      const { requestId } = req.body;
      if (!requestId) return next(new ApiError(404, 'Missing field'));
      await Request.findByIdAndDelete(requestId);
      sendRes(res, 204);
    } catch (error) {
      next(error);
    }
  },
  getCommentById: async (req, res, next) => {
    try {
      const { commentId } = req.query;
      if (!commentId) return next(new ApiError(404, 'Missing field'));
      const comment = await Comment.findById(commentId);
      sendRes(res, 200, comment);
    } catch (error) {
      next(error);
    }
  },
  createComment: async (req, res, next) => {
    try {
      const { accountId, requestId, content } = req.body;
      if (!accountId || !requestId || !content)
        return next(new ApiError(404, 'Missing field'));

      // create new comment in request
      const comment = new Comment({ account: accountId, content });
      const saved = await comment.save();

      const commentWithAccount = await Comment.findById(saved._id).populate({
        path: 'account',
        select: 'name',
      });

      // update comments in request
      const updated = await Request.findByIdAndUpdate(
        requestId,
        { $push: { comments: comment._id } },
        { new: true }
      );

      const teacherId = updated.teacher._id.toString();
      const studentId = updated.student._id.toString();

      if (accountId === teacherId) {
        const notification = new Notification({
          request: updated._id.toString(),
          receiver: studentId,
          type: 'chat',
          comment: commentWithAccount._id.toString(),
        });
        const savedNotif = await notification.save();

        sendNotification({
          receiver: studentId,
          type: 'chat',
          comment: commentWithAccount,
        });
        // send notif to student
      }

      if (accountId === studentId) {
        const notification = new Notification({
          request: updated._id.toString(),
          receiver: teacherId,
          type: 'chat',
          comment: commentWithAccount._id.toString(),
        });
        const savedNotif = await notification.save();

        // send notif to teacher
        sendNotification({
          receiver: teacherId,
          type: 'chat',
          comment: commentWithAccount,
        });
      }

      sendRes(res, 201, comment);
    } catch (error) {
      next(error);
    }
  },
  updateComment: async (req, res, next) => {
    try {
      const { commentId } = req.query;
      const { content } = req.body;
      if (!commentId) return next(new ApiError(404, 'Missing field'));
      const result = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { returnDocument: 'after' }
      );
      sendRes(res, 200, result);
    } catch (error) {
      next(error);
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const { commentId } = req.body;
      if (!commentId) return next(new ApiError(404, 'Missing field'));
      await Comment.findByIdAndDelete(commentId);
      sendRes(res, 204);
    } catch (error) {
      next(error);
    }
  },
};
