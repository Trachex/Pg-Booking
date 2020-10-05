const { Booking, Room } = require('../models');

exports.index = (req, res) => {}

exports.reserve = async (req, res) => {
    const { owner, from, to, roomId } = req.body;

    try {
        const roomCheck = await Room.findByPk(roomId);
        if (!roomCheck) throw new Error('Such room doesn`t exist');

        // validate the room isn`t reserved

        const instance = await Booking.create({
            owner,
            from,
            to
        });

        await instance.setRoom(roomCheck);

        return res.json({
            success: true
        });

    } catch (err) {
        return res.json({
            success: false,
            text: err.message
        });
    }
}
