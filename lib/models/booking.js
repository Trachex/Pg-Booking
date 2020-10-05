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

module.exports = Booking;