const adminController = require('../controllers/admin.controller');
const { authorizeAdmin, authenticateJWT } = require('../middlewares/auth');

const adminRoute = require('express').Router();

// part1
adminRoute.get('/accounts', authenticateJWT, authorizeAdmin, adminController.getAccounts);
adminRoute.get('/classes', authenticateJWT, authorizeAdmin, adminController.getClasses);
adminRoute.post('/account/map', authenticateJWT, authorizeAdmin, adminController.mappingStudent);
adminRoute.post('/account/lock', authenticateJWT, authorizeAdmin, adminController.lockAccount);
adminRoute.post('/account/unlock', authenticateJWT, authorizeAdmin, adminController.unlockAccount);
adminRoute.post('/class/invitationcode', authenticateJWT, authorizeAdmin, adminController.createInvitationCode);
adminRoute.post(
  '/class/invitationcode/remove',
  authenticateJWT, authorizeAdmin,
  adminController.removeInvitationCode
);

// part2
adminRoute.post('/account/unmap', authenticateJWT, authorizeAdmin, adminController.unmapStudent);
adminRoute.post('/class/active', authenticateJWT, authorizeAdmin, adminController.activeClass);
adminRoute.post('/class/inactive', authenticateJWT, authorizeAdmin, adminController.inactiveClass);
adminRoute.post('/students/map', authenticateJWT, authorizeAdmin, adminController.mappingStudents);

module.exports = adminRoute;
