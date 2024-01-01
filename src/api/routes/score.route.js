const { sendRes, sendErr } = require('../helpers/response');
const scoreRoute = require('express').Router();
const scoreController = require('../controllers/score.controller');

// utils API

// Score Type
scoreRoute.get('/types', scoreController.getTypes); // done - test ok
scoreRoute.get('/class-types', scoreController.getTypeByClassId); // done - test ok
scoreRoute.post('/create-type', scoreController.createType); // done - test ok
scoreRoute.post('/update-type', scoreController.updateType); // done - test ok
scoreRoute.post('/delete-type', scoreController.deleteType); // done - test ok

// Score

scoreRoute.get('/scores-final', scoreController.getScoresFinal); // done
scoreRoute.get('/scores', scoreController.getScores); // done - test ok
scoreRoute.get('/class-scores', scoreController.getScoreByClassId); // done - test ok
scoreRoute.get('/student-scores', scoreController.getScoreByStudentId); // done - test ok
scoreRoute.post('/create-score', scoreController.createScore); // done - test ok
scoreRoute.post('/update-score', scoreController.updateScore); // done - test ok
scoreRoute.post('/delete-score', scoreController.deleteScore); // done - test ok

// main API:

// - Show current grade structure:
scoreRoute.get('/types', scoreController.getTypes); // done
scoreRoute.get('/class-types', scoreController.getTypeByClassId); // done

// - Add a grade composition with a name and grade scale (only choose in grade structure list)
scoreRoute.post('/create-type', scoreController.createType); // done

// Remove a grade composition  // done
scoreRoute.get('/delete-type', scoreController.deleteType); // done

// Update a grade composition (name, grade scale)
// Mark a grade composition as finalized
scoreRoute.post('/update-type', scoreController.updateType); // done

// Class owner uploads a csv/xlsx file with student list (StudentId, Full name) // doing
scoreRoute.post('/mock/add-students', (req, res) => {
    // @todo: handle xls file here and add to database
    sendRes(res, 200);
});

// extra
scoreRoute.post('/scores', scoreController.createScore); // done

// Show Students (pre-upload full student list) x Grades board
// Show total grade column at grade board
scoreRoute.get('/scores-final', scoreController.getScoresFinal); // done

// View list of grade reviews requested by students
scoreRoute.get('/requests', scoreController.getRequests); // done
scoreRoute.post('/create-request', scoreController.createRequest); // done
scoreRoute.get('/request-details', scoreController.getRequestById); // done
scoreRoute.get('/class-requests', scoreController.getRequestsByClassId); // done

// Update - delete Request
scoreRoute.post('/update-request', scoreController.updateRequest); // done
scoreRoute.post('/delete-request', scoreController.deleteRequest); // done

// View grade review details: Student, grade composition, current grade, student expectation grade, student explanation

// Get comment by id
scoreRoute.get('/comment', scoreController.getCommentById); // done
// Comment on a student review
scoreRoute.post('/create-comment', scoreController.createComment); // done

// Update - Delete comment by id
scoreRoute.post('/update-comment', scoreController.updateComment); // done
scoreRoute.post('/delete-comment', scoreController.deleteComment); // done

// Mark the final decision for a student review with an updated grade
scoreRoute.post('/update-score', scoreController.updateScore); // done


module.exports = scoreRoute;
