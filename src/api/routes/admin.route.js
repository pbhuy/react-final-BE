const adminController = require('../controllers/admin.controller');
const {
  authenticateJWT,
  authorizeAdmin,
  exceptStudent,
} = require('../middlewares/auth');

const adminRoute = require('express').Router();

// no need to be admin: user can be student, teacher or admin
adminRoute.post('/account/map', adminController.mappingStudent);

// need to be admin
adminRoute.get(
  '/accounts',
  authenticateJWT,
  authorizeAdmin,
  adminController.getAccounts
);
adminRoute.get(
  '/classes',
  authenticateJWT,
  authorizeAdmin,
  adminController.getClasses
);
adminRoute.post(
  '/account/lock',
  authenticateJWT,
  authorizeAdmin,
  adminController.lockAccount
);
adminRoute.post(
  '/account/unlock',
  authenticateJWT,
  authorizeAdmin,
  adminController.unlockAccount
);
adminRoute.post(
  '/class/invitationcode',
  authenticateJWT,
  authorizeAdmin,
  adminController.createInvitationCode
);
adminRoute.post(
  '/class/invitationcode/remove',
  authenticateJWT,
  authorizeAdmin,
  adminController.removeInvitationCode
);

adminRoute.post(
  '/account/unmap',
  authenticateJWT,
  authorizeAdmin,
  adminController.unmapStudent
);
adminRoute.post(
  '/class/active',
  authenticateJWT,
  authorizeAdmin,
  adminController.activeClass
);
adminRoute.post(
  '/class/inactive',
  authenticateJWT,
  authorizeAdmin,
  adminController.inactiveClass
);
adminRoute.post(
  '/students/map',
  authenticateJWT,
  exceptStudent,
  adminController.mappingStudents
);

// part 3: admin account create
adminRoute.post('/create', adminController.createAccount);

module.exports = adminRoute;
