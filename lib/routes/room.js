const router = require('express').Router();

const {
    room
} = require('../controllers');

router.post('/create', room.create);


module.exports = router;