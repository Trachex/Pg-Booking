const sequelize = require('../middleware/postgres');
const { DataTypes } = require('sequelize');

const Booking = sequelize.define('Booking', {
    owner: {
        type: DataTypes.STRING
    },
    from: {
        type: DataTypes.DATEONLY
    },
    to: {
        type: DataTypes.DATEONLY
    }
});

Booking.isDayAvailableForChange = async (date, id, roomId) => {
    const bookings = await sequelize.query(`SELECT * FROM "Bookings" WHERE '${date}' BETWEEN "from" AND "to"`);

    const check = bookings[0].filter(el => {
        if (el.id !== id && el.roomId === roomId) return true;
    });

    return check.length === 0 ? true : false;
}

Booking.isDayAvailable = async (date, id) => {
    const [ check ] = await sequelize.query(`SELECT * FROM "Bookings" WHERE '${date}' BETWEEN "from" AND "to" AND "roomId"=${id}`,
    { raw: true });

    return check.length === 0 ? true : false;
}

Booking.doesOverlap = (from1, to1, from2, to2) => {
    const fr1 = new Date(from1);
    const t1 = new Date(to1);
    const fr2 = new Date(from2);
    const t2 = new Date(to2);

    return (fr1.getTime() <= t2.getTime() && t1.getTime() >= fr2.getTime());
}

module.exports = Booking;