const classroomController = require('../controllers/classroom.controller');
const { authenticateJWT, authorizeTeacher } = require('../middlewares/auth');

const classRoute = require('express').Router();

const logger = (...content) => {
  console.log('[CLASS ROUTE] ' + content);
};

// utils API
classRoute.get('/', classroomController.getClass);
classRoute.post(
  '/create',
  authenticateJWT,
  authorizeTeacher,
  classroomController.createClass
);
// add member via existed invitation code
classRoute.post('/add', classroomController.addMember);

// invite member via email
classRoute.post(
  '/invite',
  authenticateJWT,
  authorizeTeacher,
  classroomController.inviteMember
);

module.exports = classRoute;
