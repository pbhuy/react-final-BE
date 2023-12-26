const { sendRes, sendErr } = require('../helpers/response');
const ApiError = require('../helpers/error');

const Type = require('../models/Scores/type.model');
const Score = require('../models/Scores/score.model');
const Request = require('../models/Scores/request.model');
const Comment = require('../models/Scores/comment.model');
// const Semester = require('../models/Scores/semester.model')
// const Semester = require('../models/Scores/semester.model')
// const Semester = require('../models/Scores/semester.model')
// const Semester = require('../models/Scores/semester.model')

module.exports = {
    // Type controllers
    getTypes: async (req, res, next) => {
        try {
            const types = await Type.find().populate({
                path: 'classId',
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
            const types = await Type.find({ classId }).populate({
                path: 'classId',
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
            if (!name || !classId)
                return next(new ApiError(404, 'Missing field'));
            const type = new Type({ name, percentage, classId });
            await type.save();
            sendRes(res, 200, type);
        } catch (error) {
            next(error);
        }
    },
    updateType: async (req, res, next) => {
        try {
            const { typeId } = req.query;
            const { name, percentage } = req.body;
            let result;
            if (!typeId || (!name && !percentage))
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
            sendRes(res, 200, result);
        } catch (error) {
            next(error);
        }
    },
    deleteType: async (req, res, next) => {
        try {
            const { typeId } = req.query;
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
            const scores = await Score.find().populate({
                path: 'studentId teacherId typeId',
                select: 'name percentage classId',
            });
            sendRes(res, 200, scores);
        } catch (error) {
            next(error);
        }
    },
    getScoresFinal: async (req, res, next) => {
        try {
            const scores = await Score.find().populate({
                path: 'studentId teacherId typeId',
                select: 'name percentage classId',
            });
            sendRes(res, 200, scores);
        } catch (error) {
            next(error);
        }
    },
    getScoreByClassId: async (req, res, next) => {
        try {
            const { classId } = req.query;
            const scores = await Score.find()
                .populate({
                    path: 'studentId teacherId typeId',
                    select: 'name percentage classId',
                })
                .lean();
            let result = [];
            scores.forEach(function (score) {
                if (score.typeId.classId.toString() === classId)
                    result.push(score);
            });
            sendRes(res, 200, result);
        } catch (error) {
            next(error);
        }
    },
    createScore: async (req, res, next) => {
        try {
            const { studentId, teacherId, typeId, value } = req.body;
            if (!studentId || !teacherId || !typeId || !value)
                return next(new ApiError(404, 'Missing field'));
            const score = new Score({ studentId, teacherId, typeId, value });
            await score.save();
            sendRes(res, 200, score);
        } catch (error) {
            next(error);
        }
    },
    updateScore: async (req, res, next) => {
        try {
            const { studentId, teacherId, typeId, value } = req.body;
            if (!studentId || !teacherId || !typeId || !value)
                return next(new ApiError(404, 'Missing field'));
            const score = await Score.findOneAndUpdate(
                { studentId, teacherId, typeId },
                { value },
                { returnDocument: 'after' }
            );
            sendRes(res, 200, score);
        } catch (error) {
            next(error);
        }
    },
    deleteScore: async (req, res, next) => {
        try {
            const { scoreId } = req.query;
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
            const requests = await Request.find();
            sendRes(res, 200, requests);
        } catch (error) {
            next(error);
        }
    },
    getRequestById: async (req, res, next) => {
        try {
            const { requestId } = req.query;
            if (!requestId) return next(new ApiError(404, 'Missing field'));
            const request = await Request.findById(requestId);
            sendRes(res, 200, request);
        } catch (error) {
            next(error);
        }
    },
    getRequestsByClassId: async (req, res, next) => {
        try {
            const { classId } = req.query;
            const requests = await Request.find({ classId });
            sendRes(res, 200, requests);
        } catch (error) {
            next(error);
        }
    },
    createRequest: async (req, res, next) => {
        try {
            const {
                title,
                description,
                scoreId,
                expectation,
                studentId,
                teacherId,
                classId,
            } = req.body;
            const request = new Request({
                title,
                description,
                scoreId,
                expectation,
                studentId,
                teacherId,
                classId,
            });
            await request.save();
            sendRes(res, 201, request);
        } catch (error) {
            next(error);
        }
    },
    updateRequest: async (req, res, next) => {
        try {
            const {
                title,
                description,
                scoreId,
                expectation,
                studentId,
                teacherId,
                classId,
            } = req.body;
            const request = new Request({
                title,
                description,
                scoreId,
                expectation,
                studentId,
                teacherId,
                classId,
            });
            await request.save();
            sendRes(res, 201, request);
        } catch (error) {
            next(error);
        }
    },
    deleteRequest: async (req, res, next) => {
        try {
            const {
                title,
                description,
                scoreId,
                expectation,
                studentId,
                teacherId,
                classId,
            } = req.body;
            const request = new Request({
                title,
                description,
                scoreId,
                expectation,
                studentId,
                teacherId,
                classId,
            });
            await request.save();
            sendRes(res, 201, request);
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
    getCommentByRequestId: async (req, res, next) => {
        try {
            const { requestId } = req.query;
            if (!requestId) return next(new ApiError(404, 'Missing field'));
            const comments = await Comment.findOne({ requestId });
            sendRes(res, 200, comments);
        } catch (error) {
            next(error);
        }
    },
    createComment: async (req, res, next) => {
        try {
            const { accountId, requestId, content } = req.body;
            if (!accountId || !requestId || !content)
                return next(new ApiError(404, 'Missing field'));
            const comment = new Comment({ accountId, requestId, content });
            await comment.save();
            sendRes(res, 201, comment);
        } catch (error) {
            next(error);
        }
    },
    deleteComment: async (req, res, next) => {
        try {
            const { commentId } = req.query;
            if (!commentId) return next(new ApiError(404, 'Missing field'));
            await Comment.findByIdAndDelete(commentId);
            sendRes(res, 204);
        } catch (error) {
            next(error);
        }
    },
};
