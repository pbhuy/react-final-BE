const router = require("express").Router();

const accountRoute = require("./account.route");
const adminRoute = require("./admin.route");
const classRoute = require("./class.route");
const classesRoute = require("./classes.route");
const scoreRoute = require("./score.route");

router.use("/class", classRoute);
router.use("/classes", classesRoute);
router.use("/accounts", accountRoute);
router.use("/score", scoreRoute);
router.use("/admin", adminRoute);

module.exports = router;
