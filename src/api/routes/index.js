const router = require('express').Router();

const accountRoute = require('./account.route');
const scoreRoute = require('./score.route');

router.use('/accounts', accountRoute);
router.use('/score', scoreRoute);

module.exports = router;
