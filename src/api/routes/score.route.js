const mockData = require('../../data/mockData');
const { sendRes, sendErr } = require('../helpers/response');
const scoreRoute = require('express').Router();


// utils API
scoreRoute.get('/mock/semesters', (req,res) =>{
  sendRes(res, 200,  mockData.getSemesters());
});

scoreRoute.get('/mock/scoretypes', (req,res) =>{
  sendRes(res, 200,  mockData.getScoreTypes());
});


scoreRoute.get('/mock/subjects', (req,res) =>{
  const {teacherId, semesterId }= req.query;
  if(!teacherId || ! semesterId ){
    return sendErr(res,{status: 500, message: "Missing required params"})
  }
  return sendRes(res, 200,  mockData.getSubjects());
});


// main API:

// - Show current grade structure:
scoreRoute.post('/mock/grade-structure', (req,res) =>{
  const {teacherId, subjectId, semesterId} = req.body;
  sendRes(res, 200,  mockData.getScoreStructure());
});

// - Add a grade composition with a name and grade scale

scoreRoute.get('/mock/add-grade-composition', (req,res) =>{
  const {subjectId,teacherId,semester,scoretype} = req.body;
  sendRes(res, 200,  mockData.getScoreStructure());
});


module.exports = scoreRoute;
