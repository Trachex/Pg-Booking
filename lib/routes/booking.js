const router = require('express').Router();

const {
    booking
} = require('../controllers');

router.get('/', booking.index);
router.post('/reserve', booking.reserve);


module.exports = router;