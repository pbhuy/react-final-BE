const { sendRes, sendErr } = require('../helpers/response');
const ApiError = require('../helpers/error');
const Semester = require('../models/Scores/semester.model');
const ScoreType = require('../models/Scores/scoreType.model');
const Subject = require('../models/Scores/subject.model');
const ScoreStructure = require('../models/Scores/scoreStructure.model');
const Account = require('../models/account.model');
const Score = require('../models/Scores/score.model');

// const Semester = require('../models/Scores/semester.model')
// const Semester = require('../models/Scores/semester.model')
// const Semester = require('../models/Scores/semester.model')
// const Semester = require('../models/Scores/semester.model')
// const Semester = require('../models/Scores/semester.model')

module.exports = {
    getSemesters: async (req, res, next) => {
        try {
            const semesters = await Semester.find();
            sendRes(res, 200, semesters);
        } catch (error) {
            next(error);
        }
    },
    createSemester: async (req, res, next) => {
        try {
            const { name } = req.body;
            if (!name) return next(new ApiError(404, 'Missing field'));
            const semester = new Semester({ name });
            await semester.save();
            sendRes(res, 201, semester);
        } catch (error) {
            next(error);
        }
    },
    updateSemester: async (req, res, next) => {
        try {
            const { name } = req.body;
            const { semesterId } = req.query;
            if (!name || !semesterId)
                return next(new ApiError(404, 'Missing field'));
            const semester = await Semester.findByIdAndUpdate(
                semesterId,
                { name },
                { returnDocument: 'after' }
            );
            sendRes(res, 200, semester);
        } catch (error) {
            next(error);
        }
    },
    deleteSemester: async (req, res, next) => {
        try {
            const { semesterId } = req.query;
            if (!semesterId) return next(new ApiError(404, 'Missing field'));
            await Semester.findByIdAndDelete(semesterId);
            sendRes(res, 204);
        } catch (error) {
            next(error);
        }
    },
    getScoreTypes: async (req, res, next) => {
        try {
            const scoreTypes = await ScoreType.find();
            sendRes(res, 200, scoreTypes);
        } catch (error) {
            next(error);
        }
    },
    createScoreType: async (req, res, next) => {
        try {
            const { name } = req.body;
            if (!name) return next(new ApiError(404, 'Missing field'));
            const scoreType = new ScoreType({ name });
            await scoreType.save();
            sendRes(res, 201, scoreType);
        } catch (error) {
            next(error);
        }
    },
    updateScoreType: async (req, res, next) => {
        try {
            const { name } = req.body;
            const { scoreTypeId } = req.query;
            if (!name || !scoreTypeId)
                return next(new ApiError(404, 'Missing field'));
            const scoreType = await ScoreType.findByIdAndUpdate(
                scoreTypeId,
                { name },
                { returnDocument: 'after' }
            );
            sendRes(res, 200, scoreType);
        } catch (error) {
            next(error);
        }
    },
    deleteScoreType: async (req, res, next) => {
        try {
            const { scoreTypeId } = req.query;
            if (!scoreTypeId) return next(new ApiError(404, 'Missing field'));
            await ScoreType.findByIdAndDelete(scoreTypeId);
            sendRes(res, 204);
        } catch (error) {
            next(error);
        }
    },
    getSubjects: async (req, res, next) => {
        try {
            const subjects = await Subject.find();
            sendRes(res, 200, subjects);
        } catch (error) {
            next(error);
        }
    },
    createSubject: async (req, res, next) => {
        try {
            const { name, teacherId, semesterId } = req.body;
            if (!name || !teacherId || !semesterId)
                return next(new ApiError(404, 'Missing field'));
            const subject = new Subject({ name, teacherId, semesterId });
            await subject.save();
            sendRes(res, 201, subject);
        } catch (error) {
            next(error);
        }
    },
    getScoreStructure: async (req, res, next) => {
        const { teacherId, subjectId, semesterId } = req.body;
        try {
            if (!subjectId || !teacherId || !semesterId)
                return next(new ApiError(400, 'Missing fields'));
            const subject = await Subject.findById(subjectId);
            if (!subject) return next(new ApiError(400, 'Subject not found'));

            const teacher = await Account.findById(teacherId);
            if (!teacher) return next(new ApiError(400, 'Teacher not found'));

            const semester = await Semester.findById(semesterId);
            if (!semester) return next(new ApiError(400, 'Semester not found'));

            const scoreStructure = await ScoreStructure.findOne({
                semester: semesterId,
                teacherId,
                subjectId,
            }).lean();
            const scoreType = await ScoreType.findById(
                scoreStructure.scoreTypeId
            ).lean();
            const result = {
                scoreTypeId: scoreType._id,
                scoreTypeName: scoreType.name,
                percentage: scoreStructure.percentage,
            };
            sendRes(res, 200, result);
        } catch (error) {
            next(error);
        }
    },
    addScoreStructure: async (req, res, next) => {
        const { subjectId, teacherId, semester, scoreTypeId, percentage } =
            req.body;
        try {
            // check fields
            if (
                !subjectId ||
                !teacherId ||
                !semester ||
                !scoreTypeId ||
                !percentage
            )
                sendErr(res, new ApiError(400, 'Missing fields'));
            const scoreStructure = new ScoreStructure({
                subjectId,
                teacherId,
                semester,
                scoreTypeId,
                percentage,
            });
            await scoreStructure.save();
            sendRes(res, 200, scoreStructure);
        } catch (error) {
            next(error);
        }
    },
    removeScoreStructure: async (req, res, next) => {
        const { subjectId, teacherId, semester, scoreTypeId } = req.body;
        if (!subjectId || !teacherId || !semester || !scoreTypeId)
            return next(new ApiError(404, 'Missing field'));
        await ScoreStructure.findOneAndDelete({
            subjectId,
            teacherId,
            semester,
            scoreTypeId,
        });
        sendRes(res, 200);
    },
    updateScoreStructure: async (req, res, next) => {
        try {
            const {
                subjectId,
                teacherId,
                semesterId,
                scoreTypeId,
                percentage,
                isPublish,
            } = req.body;
            console.log({
                subjectId,
                teacherId,
                semesterId,
                scoreTypeId,
                percentage,
                isPublish,
            });
            if (!subjectId || !teacherId || !semesterId || !scoreTypeId)
                return next(new ApiError(404, 'Missing field'));
            const result = await ScoreStructure.findOneAndUpdate(
                { subjectId, teacherId, semester: semesterId, scoreTypeId },
                { percentage, isPublish },
                { returnDocument: 'after' }
            );
            sendRes(res, 200, result);
        } catch (error) {
            next(error);
        }
    },
    getScores: async (req, res, next) => {
        const { subjectId, teacherId, semesterId } = req.query;
        if (!subjectId || !teacherId || !semesterId)
            return next(new ApiError(404, 'Missing field'));
        const teacher = Account.findById(teacherId).lean();
        if (!teacher) return next(new ApiError(404, 'Teacher not found'));
        const subject = Account.findById(subjectId).lean();
        if (!subject) return next(new ApiError(404, 'Subject not found'));
        const semester = Account.findById(semesterId).lean();
        if (!semester) return next(new ApiError(404, 'Semester not found'));
        const scores = await Score.find({
            teacherId,
            subjectId,
            semester: semesterId,
        }).lean();
        sendRes(res, 200, scores);
    },
    createScore: async (req, res, next) => {
        const {
            subjectId,
            teacherId,
            semesterId,
            studentId,
            scoreTypeId,
            scoreValue,
        } = req.body;
        if (
            !subjectId ||
            !teacherId ||
            !semesterId ||
            !studentId ||
            !scoreTypeId ||
            !scoreValue
        )
            return next(new ApiError(404, 'Missing field'));
        const score = new Score({
            subjectId,
            teacherId,
            semester: semesterId,
            studentId,
            scoreTypeId,
            scoreValue,
        });
        await score.save();
        sendRes(res, 201, score);
    },
    // getScoresRequested: async (req, res, next) => {
    //     return res.status(200).json({ message: 'hello' });
    // },
    // getScoresRequestedDetail: async (req, res, next) => {
    //     return res.status(200).json({ message: 'hello' });
    // },
    // commentReview: async (req, res, next) => {
    //     return res.status(200).json({ message: 'hello' });
    // },
    updateScore: async (req, res, next) => {
        const {
            studentId,
            teacherId,
            semesterId,
            subjectId,
            scoreTypeId,
            scoreValue,
        } = req.body;
        if (
            !studentId ||
            !teacherId ||
            !semesterId ||
            !subjectId ||
            !scoreTypeId ||
            !scoreValue
        )
            return next(new ApiError(404, 'Missing field'));
        const result = await Score.findOneAndUpdate(
            {
                studentId,
                teacherId,
                semester: semesterId,
                subjectId,
                scoreTypeId,
            },
            { scoreValue },
            { returnDocument: 'after' }
        );
        sendRes(res, 200, result);
    },
};
