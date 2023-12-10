const router = require("express").Router();

const accountRoute = require("./account.route");
const classRoute = require("./class.route");
const classesRoute = require("./classes.route");
const scoreRoute = require("./score.route");

router.use("/class", classRoute);
router.use("/classes", classesRoute);
router.use("/accounts", accountRoute);
router.use("/score", scoreRoute);

module.exports = router;
