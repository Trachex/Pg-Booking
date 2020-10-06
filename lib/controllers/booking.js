const moment = require('moment');
const { Booking, Room } = require('../models');

function numToDate(num) {
    return new Date(new Date().getFullYear(), 0, num);
}

exports.getAvailable = async (req, res) => {
    const { page, amount } = req.query;
    
    try {
        if (!page || !amount) throw new Error('Invalid params');

        const allBookings = await Booking.findAll();
        const roomAmount = await Room.count();

        const avDays = [];
        const unavDays = [];

        for (let i = (page - 1) * amount; i < (page * amount); i++) {
            const tmpRooms = [];

            allBookings.forEach(el => {
                if (moment(numToDate(i)).isBetween(el.from, el.to)) {
                    tmpRooms.indexOf(el.roomId) === -1 ? tmpRooms.push(el.roomId) : null;
                }
            });

            if (tmpRooms.length === roomAmount) unavDays.push(numToDate(i));
            else avDays.push(numToDate(i));

            if (i === 365) break;
        }

    } catch (err) {
        return res.json({
            success: false,
            text: err.message
        });
    }
}

exports.reserve = async (req, res) => {
    const { owner, from, to, roomId } = req.body;

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
    const { id, owner, from, to } = req.body;

    try {
        if (!id) throw new Error('Id is required');

        const instance = await Booking.findByPk(id);

        if (owner) instance.owner = owner;
        if (from) {
            const check = await Booking.isDayAvailable(from);
            if (check === true) instance.from = from;
            else throw new Error('From date is unavailable');
        }
        if (to) {
            const check = await Booking.isDayAvailable(to);
            if (check === true) instance.to = to;
            else throw new Error('To date is unavailable');
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