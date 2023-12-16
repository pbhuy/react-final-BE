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
    getScoreTypes: async (req, res, next) => {
        try {
            const scoreTypes = await ScoreType.find();
            // const scoretype = new ScoreType({ name: 'Final' });
            // await scoretype.save();
            sendRes(res, 200, scoreTypes);
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
    // removeScoreStructure: async (req, res, next) => {
    //     return res.status(200).json({ message: 'hello' });
    // },
    // updateScoreStructure: async (req, res, next) => {
    //     return res.status(200).json({ message: 'hello' });
    // },
    getScores: async (req, res, next) => {
        const { subjectId, teacherId, semesterId } = req.query;
        const scores = await Score.find().lean();
        sendRes(res, 200, scores);
        // sendRes(
        //     res,
        //     200,
        //     mockData.getScores({
        //         subjectId,
        //         teacherId,
        //         semesterId,
        //     })
        // );
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
    // updateScore: async (req, res, next) => {
    //     return res.status(200).json({ message: 'hello' });
    // }
};
