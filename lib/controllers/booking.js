const sequelize = require('../middleware/postgres');
const { Booking, Room } = require('../models');

function numToDate(num) {
    const time = new Date(new Date().getFullYear(), 0, num);
    return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
}

exports.getAvailable = async (req, res) => {
    const { page, amount } = req.query;

    try {
        if (!page || !amount) throw new Error('Invalid params');

        const roomAmount = await Room.count();

        const avDays = [];
        const unavDays = [];

        for (let i = (page - 1) * amount; i < (page * amount); i++) {
            const date = numToDate(i + 1);
            const [ bookings ] = await sequelize.query(`SELECT * FROM "Bookings" WHERE '${date}' BETWEEN "from" AND "to"`, { raw: true });

            if (bookings.length === roomAmount) unavDays.push(date);
            else avDays.push(date);
        }

        return res.json({
            success: true,
            avDays,
            unavDays
        });

    } catch (err) {
        return res.json({
            success: false,
            text: err.message
        });
    }
}

exports.reserve = async (req, res) => {
    let { owner, from, to, roomId } = req.body;

    from = new Date(from);
    to = new Date(to);

    try {
        const roomCheck = await Room.findByPk(roomId);
        if (!roomCheck) throw new Error('Such room doesn`t exist');
        if (from.getTime() >= to.getTime()) throw new Error('Date is invalid, from >= to');

        const roomBookings = await roomCheck.getBookings();
        roomBookings.forEach(el => {
            const check = Booking.doesOverlap(el.from, el.to, from, to);
            if (check === true) throw new Error('Date overlaps with other reservations');
        });

        const instance = await Booking.create({
            owner,
            from,
            to
        });

        await instance.setRoom(roomCheck);
        await instance.save();

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

exports.update = async (req, res) => {
    const { id, owner, from, to, roomId } = req.body;

    try {
        if (!id) throw new Error('Id is required');

        const instance = await Booking.findByPk(id);

        if (owner) instance.owner = owner;
        if (from) {
            const check = await Booking.isDayAvailableForChange(from, id, instance.roomId);
            if (check === true) instance.from = from;
            else throw new Error('From date is unavailable');
        }
        if (to) {
            const check = await Booking.isDayAvailableForChange(to, id, instance.roomId);
            if (check === true) instance.to = to;
            else throw new Error('To date is unavailable');
        }
        if (roomId) {
            const bookings = await Booking.findAll({ where: { roomId } });
            bookings.forEach(el => {
                const check = Booking.doesOverlap(el.from, el.to, instance.from, instance.to);
                if (check === true) throw new Error('Date overlaps with other reservations');
            });
            instance.roomId = roomId;
        }

        await instance.save();

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
        
        const instance = await Booking.findByPk(id);
        await instance.destroy();

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