const router = require('express').Router();

const {
    reservation
} = require('../controllers');

router.get('/', reservation.index);


module.exports = router;