const router = require('express').Router();

const {
    booking
} = require('../controllers');

router.get('/getAvailable', booking.getAvailable);
router.post('/reserve', booking.reserve);
router.put('/update', booking.update);
router.delete('/delete', booking.delete);

module.exports = router;