const router = require('express').Router();

const {
    room
} = require('../controllers');

router.get('/getAvailable', room.getAvailable);
router.post('/create', room.create);
router.put('/update', room.update);
router.delete('/delete', room.delete);

module.exports = router;