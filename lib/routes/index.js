const router = require('express').Router();

router.use('/', require('./booking'));
router.use('/room', require('./room'));

module.exports = router;