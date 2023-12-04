const { sendRes } = require("../helpers/response");

const classRoute = require("express").Router();

// utils API

classRoute.get("/test", (req, res) => {
  sendRes(res, 200, "hello");
});

module.exports = classRoute;
