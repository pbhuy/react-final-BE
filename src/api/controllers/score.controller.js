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
            const scoretype = new ScoreType({ name });
            await scoretype.save();
            sendRes(res, 201, scoretype);
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
