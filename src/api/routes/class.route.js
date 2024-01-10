const classroomController = require('../controllers/classroom.controller');
const { authenticateJWT, exceptStudent } = require('../middlewares/auth');

const classRoute = require('express').Router();
// utils API
classRoute.get('/', classroomController.getClass);
classRoute.post(
  '/create',
  authenticateJWT,
  exceptStudent,
  classroomController.createClass
);
// add member via existed invitation code
classRoute.post('/add', classroomController.addMember);

// invite member via email
classRoute.post(
  '/invite',
  authenticateJWT,
  exceptStudent,
  classroomController.inviteMember
);

module.exports = classRoute;
