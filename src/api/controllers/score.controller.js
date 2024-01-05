const { sendRes, sendErr } = require('../helpers/response');
const ApiError = require('../helpers/error');

const Type = require('../models/Scores/type.model');
const Score = require('../models/Scores/score.model');
const Request = require('../models/Scores/request.model');
const Comment = require('../models/Scores/comment.model');

module.exports = {
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
    createType: async (req, res, next) => { // done
        try {
            const { name, percentage, classId } = req.body;
            if (!name || !classId)
                return next(new ApiError(404, 'Missing field'));
            const typeOfClass = await Type.find({ class: classId }).lean();
            let totalPercentage = 0;
            let isCreated = true;
            let message = '';
            for (let type of typeOfClass) {
                totalPercentage += type.percentage;
                if (type.name === name) {
                    console.log('type.name', type.name);
                    isCreated = false;
                    message = 'Type existed';
                    break;
                }
                if (totalPercentage + percentage > 1) {
                    console.log('totalPercentage', totalPercentage);
                    isCreated = false;
                    message = 'Invalid percentage';
                    break;
                }
            };
            if (!isCreated) return next(new ApiError(404, message));
            else  {
                const type = new Type({ name, percentage, class: classId });
                await type.save();
                sendRes(res, 200, type);
            }
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
            const classOfType = await Type.findById(typeId);
            const classId = classOfType.class.toString();
            const typeOfClass = await Type.find({ class: classId }).lean();
            let totalPercentage = 0;
            let isUpdate = true;
                let message = '';
            if (name && percentage) {
                
                for (let type of typeOfClass) {
                    if (type.name === name) {
                        isUpdate = false;
                        message = 'Type existed';
                        break;
                    }
                    totalPercentage += type.percentage;
                    if (totalPercentage + percentage > 1) {
                        isUpdate = false;
                        message = 'Invalid percentage';
                        break;
                    } 
                };
                if (!isUpdate) return next(new ApiError(404, message))
                else {
                    result = await Type.findByIdAndUpdate(
                        typeId,
                        { name, percentage },
                        { returnDocument: 'after' }
                    );
                }
            }
            else if (percentage) {
                for (let type of typeOfClass) {
                    totalPercentage += type.percentage;
                    if (totalPercentage + percentage > 1) {
                        isUpdate = false;
                        message = 'Invalid percentage';
                        break;
                    }  
                };
                if (!isUpdate) return next(new ApiError(404, message))
                else
                result = await Type.findByIdAndUpdate(
                    typeId,
                    { percentage },
                    { returnDocument: 'after' }
                );
            }
            else if (name) {
                for (let type of typeOfClass) {
                    if (type.name === name) {
                        isUpdate = false;
                        message = 'Type existed';
                        break;
                    }
                };
                if (!isUpdate) return next(new ApiError(404, message))
                else
                result = await Type.findByIdAndUpdate(
                    typeId,
                    { name },
                    { returnDocument: 'after' }
                );
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
                    select: 'name mapCode',
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
            const scores = await Score.find({type: {$in: types}})
                .populate({
                    path: 'student teacher',
                    select: 'name mapCode',
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

                let teacherEntry = result.find(
                    (entry) => entry.teacher === teacher
                );
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
            const scores = await Score.find()
                .populate({
                    path: 'student teacher',
                    select: 'name mapCode',
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
            scores.forEach(function (score) {
                if (score.type.class._id.toString() === classId)
                    result.push(score);
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
                    select: 'name mapCode',
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
            sendRes(res, 200, scores);
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
    updateScore: async (req, res, next) => {
        try {
            const { studentId, teacherId, typeId, value } = req.body;
            if (!studentId || !teacherId || !typeId || !value)
                return next(new ApiError(404, 'Missing field'));
            const score = await Score.findOneAndUpdate(
                { student: studentId, teacher: teacherId, type: typeId },
                { value },
                { returnDocument: 'after' }
            );
            sendRes(res, 200, score);
        } catch (error) {
            next(error);
        }
    },
    updateStudentScore: async (req, res, next) => {
        try {
            const { teacherId, classId, studentId, scores } = req.body;
            if (!classId || !teacherId || !scores || !studentId)
                return next(new ApiError(404, 'Missing field'));
            // get all scores of student
            const studentScores = await Score.find({teacher: teacherId, student: studentId}).lean();
            // update scores of student for each type in class
            for (let score of scores) {
                for (let studentScore of studentScores) {
                    if (score.typeId === studentScore.type.toString()) {
                        await Score.findByIdAndUpdate(studentScore._id, { value: score.value });
                        break;
                    }
                }
            }
            // response result
            const result = await Score.find({teacher: teacherId, student: studentId}).populate({
                path: 'student teacher',
                select: 'name mapCode',
            }).populate({
                path: 'type',
                select: 'name percentage',
            }).lean();
            sendRes(res, 200, result);
        } catch (error) {
            next(error);
        }
    },
    updateClassScore: async (req, res, next) => {
        try {
            const { teacherId, classId, students, scores } = req.body;
            if (!classId || !teacherId || !scores || !students)
                return next(new ApiError(404, 'Missing field'));
            // get all scores of students
            let studentScores = [];
            for (let student of students) {
                studentScores = await Score.find({teacher: teacherId, student: student.studentId}).lean();
                // update scores of student for each type in class
                for (let score of scores) {
                    for (let studentScore of studentScores) {
                        if (score.typeId === studentScore.type.toString()) {
                            await Score.findByIdAndUpdate(studentScore._id, { value: score.value });
                            break;
                        }
                    }
                }
            }
            // response result
            studentScores = await Score.find({teacher: teacherId, student: {$in: students.map(student => student.studentId)}}).populate({
                path: 'student teacher',
                select: 'name mapCode',
            }).populate({
                path: 'type',
                select: 'name percentage',
            }).lean();
            sendRes(res, 200, studentScores);
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
                    select: 'name mapCode',
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
                    select: 'name mapCode',
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
                    select: 'name mapCode',
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
            } = req.body;
            if (
                !title ||
                !explain ||
                !studentId ||
                !teacherId ||
                !classId ||
                !actualScore ||
                !expectedScore
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
            });
            await request.save();
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
            const request = await Request.findByIdAndUpdate(
                requestId,
                updateFields,
                { returnDocument: 'after' }
            );
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
            await comment.save();

            // update comments in request
            await Request.findByIdAndUpdate(
                requestId,
                { $push: { comments: comment._id } },
                { new: true }
            );
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
