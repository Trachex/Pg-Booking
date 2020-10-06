const sequelize = require('../middleware/postgres');
const { Room } = require('../models');

exports.create = async (req, res) => {
    const { number } = req.body;

    try {
        if (!number) throw new Error('Not all params');

        const room = await Room.create({
            number
        });

        await room.save();

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

exports.getAvailable = async (req, res) => {
    const { date } = req.params;

    try {
        if (!date) throw new Error('Not all params');

        const roomIds = await sequelize.query(`SELECT DISTINCT roomId FROM booking WHERE ${date} NOT BETWEEN from AND to`);

        const rooms = await Room.findAll({ where: { id: roomIds } });

        return res.json({
            success: true,
            rooms
        });

    } catch (err) {
        return res.json({
            success: false,
            text: err.message
        });
    }
}

exports.update = async (req, res) => {
    const { number, id } = req.body;

    try {
        if (!id || !number) throw new Error('Not all params');

        const room = await Room.findByPk(id);
        room.number = number;
        await room.save();

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

exports.delete = async (req, res) => {
    const { id } = req.body;

    try {
        if (!id) throw new Error('Not all params');

        const room = await Room.findByPk(id);
        const bookings = await room.getBookings();

        bookings.forEach(el => {
            await el.destroy();
        });
        await room.destroy();

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
