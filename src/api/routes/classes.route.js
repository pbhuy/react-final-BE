const { sendRes } = require("../helpers/response");

const classesRoute = require("express").Router();

// utils API

classesRoute.get("/test", (req, res) => {
  sendRes(res, 200, "hello");
});

module.exports = classesRoute;
