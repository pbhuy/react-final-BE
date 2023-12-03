const mockData = require("../../data/mockData");
const { sendRes, sendErr } = require("../helpers/response");
const scoreRoute = require("express").Router();

// utils API

scoreRoute.get("/mock/semesters", (req, res) => {
  sendRes(res, 200, mockData.getSemesters());
});

scoreRoute.get("/mock/scoretypes", (req, res) => {
  sendRes(res, 200, mockData.getScoreTypes());
});

scoreRoute.get("/mock/subjects", (req, res) => {
  const { teacherId, semesterId } = req.query;
  if (!teacherId || !semesterId) {
    return sendErr(res, { status: 500, message: "Missing required params" });
  }
  return sendRes(res, 200, mockData.getSubjects({ teacherId, semesterId }));
});

// main API:

// - Show current grade structure:
scoreRoute.post("/mock/grade-structure", (req, res) => {
  const { teacherId, subjectId, semesterId } = req.body;
  sendRes(
    res,
    200,
    mockData.getScoreStructure({ teacherId, subjectId, semesterId })
  );
});

// - Add a grade composition with a name and grade scale (only choose in grade structure list)
scoreRoute.post("/mock/add-grade-composition", (req, res) => {
  const { subjectId, teacherId, semester, scoreTypeId, percentage } = req.body;
  sendRes(
    res,
    200,
    mockData.addScoreStructure({
      subjectId,
      teacherId,
      semester,
      scoreTypeId,
      percentage,
    })
  );
});

// Remove a grade composition
scoreRoute.post("/mock/remove-grade-composition", (req, res) => {
  const { subjectId, teacherId, semester, scoreTypeId } = req.body;
  sendRes(
    res,
    200,
    mockData.removeScoreStructure({
      subjectId,
      teacherId,
      semester,
      scoreTypeId,
      updateScoreStructure,
    })
  );
});

// Update a grade composition (name, grade scale)
// Mark a grade composition as finalized
scoreRoute.post("/mock/update-grade-composition", (req, res) => {
  const {
    subjectId,
    teacherId,
    semesterId,
    scoreTypeId,
    newScoreTypeName,
    isPublish,
  } = req.body;
  sendRes(
    res,
    200,
    mockData.updateScoreStructure({
      subjectId,
      teacherId,
      semesterId,
      scoreTypeId,
      isPublish,
      newScoreTypeName,
    })
  );
});

// Class owner uploads a csv/xlsx file with student list (StudentId, Full name)
scoreRoute.post("/mock/add-students", (req, res) => {
  // @todo: handle xls file here and add to database
  sendRes(res, 200);
});

// Show Students (pre-upload full student list) x Grades board
// Show total grade column at grade board
scoreRoute.get("/mock/scores", (req, res) => {
  const { subjectId, teacherId, semesterId } = req.query;
  // @todo: handle xls file here and add to database
  sendRes(
    res,
    200,
    mockData.getScores({
      subjectId,
      teacherId,
      semesterId,
    })
  );
});

// View list of grade reviews requested by students
scoreRoute.get("/mock/reviews-requested", (req, res) => {
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
scoreRoute.get("/mock/review-requested-detail", (req, res) => {
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
scoreRoute.get("/mock/comment-review", (req, res) => {
  const { userId, reviewRequestedId, content } = req.query;
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
scoreRoute.post("/mock/update-score", (req, res) => {
  const {
    studentId,
    teacherId,
    semesterId,
    subjectId,
    scoreTypeId,
    scoreValue,
  } = req.body;
  // @todo: handle xls file here and add to database
  sendRes(
    res,
    200,
    mockData.updateScore({
      studentId,
      teacherId,
      semesterId,
      subjectId,
      scoreTypeId,
      scoreValue,
    })
  );
});

module.exports = scoreRoute;
