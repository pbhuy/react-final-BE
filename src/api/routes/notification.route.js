const notifController = require('../controllers/notif.controller');
const notifRoute = require('express').Router();

notifRoute.get('/', notifController.getUserNotif);

module.exports = notifRoute;
