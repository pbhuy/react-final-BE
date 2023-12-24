const mockData = require('../../data/mockData');
const { sendRes, sendErr } = require('../helpers/response');
const scoreRoute = require('express').Router();
const scoreController = require('../controllers/score.controller');

// utils API

scoreRoute.get('/semesters', scoreController.getSemesters); // done
scoreRoute.post('/semesters', scoreController.createSemester); // done

scoreRoute.get('/scoretypes', scoreController.getScoreTypes); // done
scoreRoute.post('/scoretypes', scoreController.createScoreType); // done

scoreRoute.get('/subjects', scoreController.getSubjects); // done
scoreRoute.post('/subjects', scoreController.createSubject); // done

// main API:

// - Show current grade structure:
scoreRoute.post('/grade-structure', scoreController.getScoreStructure); // done

// - Add a grade composition with a name and grade scale (only choose in grade structure list)
scoreRoute.post('/add-grade-composition', scoreController.addScoreStructure); // done

// Remove a grade composition  // done
scoreRoute.post(
    '/remove-grade-composition',
    scoreController.removeScoreStructure
);

// Update a grade composition (name, grade scale)
// Mark a grade composition as finalized
scoreRoute.post(
    '/update-grade-composition',
    scoreController.updateScoreStructure // done
);

// Class owner uploads a csv/xlsx file with student list (StudentId, Full name)
scoreRoute.post('/mock/add-students', (req, res) => {
    // @todo: handle xls file here and add to database
    sendRes(res, 200);
});

// extra
scoreRoute.post('/scores', scoreController.createScore); // done

// Show Students (pre-upload full student list) x Grades board
// Show total grade column at grade board
scoreRoute.get('/scores', scoreController.getScores); //

// View list of grade reviews requested by students
scoreRoute.get('/mock/reviews-requested', (req, res) => {
    const { subjectId, teacherId, semesterId } = req.query;
    // @todo: handle xls file here and add to database
    sendRes(
        res,
        200,
        mockData.getScoresRequested({
            subjectId,
            teacherId,
            semesterId,
        })
    );
});

// View grade review details: Student, grade composition, current grade, student expectation grade, student explanation
scoreRoute.get('/mock/review-requested-detail', (req, res) => {
    const { subjectId, teacherId, semesterId, reviewRequestedId } = req.query;
    // @todo: handle xls file here and add to database
    sendRes(
        res,
        200,
        mockData.getScoresRequestedDetail({
            subjectId,
            teacherId,
            semesterId,
            reviewRequestedId,
        })
    );
});

// Comment on a student review
scoreRoute.post('/mock/comment-review', (req, res) => {
    const { userId, reviewRequestedId, content } = req.body;
    // @todo: handle xls file here and add to database
    sendRes(
        res,
        200,
        mockData.commentReview({
            userId,
            reviewRequestedId,
            content,
        })
    );
});

// Mark the final decision for a student review with an updated grade
scoreRoute.post('/mock/update-score', scoreController.updateScore);

module.exports = scoreRoute;
