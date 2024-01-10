const classroomController = require('../controllers/classroom.controller');
const { authenticateJWT, authorizeTeacher } = require('../middlewares/auth');

const classRoute = require('express').Router();

const logger = (...content) => {
  console.log('[CLASS ROUTE] ' + content);
};

// utils API

// @todo: teacher route restricted
classRoute.get('/', classroomController.getClass);
classRoute.post(
  '/create',
  authenticateJWT,
  authorizeTeacher,
  classroomController.createClass
);
classRoute.post('/add', classroomController.addMember);
classRoute.post('/invite', classroomController.inviteMember);

module.exports = classRoute;
