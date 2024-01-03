const adminController = require('../controllers/admin.controller');

const adminRoute = require('express').Router();

// part1
adminRoute.get('/accounts', adminController.getAccounts);
adminRoute.get('/classes', adminController.getClasses);
adminRoute.post('/account/map', adminController.mappingStudent);
adminRoute.post('/account/lock', adminController.lockAccount);
adminRoute.post('/account/unlock', adminController.unlockAccount);
adminRoute.post('/class/invitationcode', adminController.createInvitationCode);
adminRoute.post(
  '/class/invitationcode/remove',
  adminController.removeInvitationCode
);

// part2
adminRoute.post('/account/unmap', adminController.unmapStudent);
adminRoute.post('/class/active', adminController.activeClass);
adminRoute.post('/class/inactive', adminController.inactiveClass);
adminRoute.post('/students/map', adminController.mappingStudents);

module.exports = adminRoute;
