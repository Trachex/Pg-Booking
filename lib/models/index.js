const Room = require('./room');
const Booking = require('./booking');

Room.hasMany(Booking);
Booking.belongsTo(Room);

exports.Room = Room;
exports.Booking = Booking;