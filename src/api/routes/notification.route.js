const notificationController = require('../controllers/notification.controller');
const notifRoute = require('express').Router();

notifRoute.get('/', notificationController.getUserNotif);

module.exports = notifRoute;
