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
}, {
    classMethods: {
        isDayAvailable: async (date) => {
            const check = await sequelize.query(`SELECT * FROM booking WHERE ${date} BETWEEN from AND to`);
            if (check) return false;
            else return true;
        },
        doesOverlap: (from1, to1, from2, to2) => {
            return (from1.getTime() <= to2.getTime() && to1.getTime() >= from2.getTime());
        }
    }
});

module.exports = Booking;