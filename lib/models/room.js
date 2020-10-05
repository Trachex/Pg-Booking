const sequelize = require('../middleware/postgres');
const { DataTypes } = require('sequelize');

const Room = sequelize.define('room', {
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
});

module.exports = Room;