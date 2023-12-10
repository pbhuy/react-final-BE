const classroomController = require("../controllers/classroom.controller");
const { sendRes } = require("../helpers/response");

const classesRoute = require("express").Router();

// utils API

classesRoute.get("/", classroomController.getClasses);

module.exports = classesRoute;
