const mockData = require('../../data/mockData');
const { sendRes, sendErr } = require('../helpers/response');
const scoreRoute = require('express').Router();
const scoreController = require('../controllers/score.controller');

// utils API

// Score Type
scoreRoute.get('/types', scoreController.getTypes); // done
scoreRoute.get('/class-types', scoreController.getTypeByClassId); // done
scoreRoute.post('/create-types', scoreController.createType); // done
scoreRoute.post('/update-types', scoreController.updateType); // done
scoreRoute.get('/delete-types', scoreController.deleteType); // done

// Score
scoreRoute.get('/scores', scoreController.getScores); // done

scoreRoute.get('/scores-final', scoreController.getScoresFinal); // doing

scoreRoute.get('/class-scores', scoreController.getScoreByClassId); // done
scoreRoute.get('/student-scores', scoreController.getScoreByStudentId); // done
scoreRoute.post('/create-scores', scoreController.createScore); // done
scoreRoute.post('/update-scores', scoreController.updateScore); // done
scoreRoute.get('/delete-scores', scoreController.deleteScore); // done

// main API:

// - Show current grade structure:
scoreRoute.get('/types', scoreController.getTypes); // done
scoreRoute.get('/class-types', scoreController.getTypeByClassId); // done

// - Add a grade composition with a name and grade scale (only choose in grade structure list)
scoreRoute.post('/create-types', scoreController.createType); // done

// Remove a grade composition  // done
scoreRoute.get('/delete-types', scoreController.deleteType); // done

// Update a grade composition (name, grade scale)
// Mark a grade composition as finalized
scoreRoute.post('/update-types', scoreController.updateType); // done

// Class owner uploads a csv/xlsx file with student list (StudentId, Full name) // doing
scoreRoute.post('/mock/add-students', (req, res) => {
    // @todo: handle xls file here and add to database
    sendRes(res, 200);
});

// Show Students (pre-upload full student list) x Grades board
// Show total grade column at grade board
scoreRoute.get('/scores-final', scoreController.getScoresFinal); // doing

// View list of grade reviews requested by students
scoreRoute.get('/requests', scoreController.getRequests); // done
scoreRoute.post('/create-requests', scoreController.createRequest); // done
scoreRoute.get('/request-details', scoreController.getRequestById); // done
scoreRoute.get('/class-requests', scoreController.getRequestsByClassId); // done

// Update - delete Request
scoreRoute.post('/update-requests', scoreController.updateRequest); // doing
scoreRoute.get('/delete-requests', scoreController.deleteRequest); // doing

// View grade review details: Student, grade composition, current grade, student expectation grade, student explanation
scoreRoute.get('/comment-request', scoreController.getCommentByRequestId); // done

// Get comment by id
scoreRoute.get('/comment', scoreController.getCommentById); // done
// Comment on a student review
scoreRoute.post('/create-comment', scoreController.createComment); // done
// Get all comments of the request by request id
scoreRoute.get('/comment-request', scoreController.getCommentByRequestId); // done
// Delete comment by id
scoreRoute.get('/delete-comment', scoreController.deleteComment); // done
// Mark the final decision for a student review with an updated grade
scoreRoute.post('/update-scores', scoreController.updateScore); // done

module.exports = scoreRoute;
