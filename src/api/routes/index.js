const router = require('express').Router();

const accountRoute = require('./account.route');

router.use('/accounts', accountRoute);

module.exports = router;
