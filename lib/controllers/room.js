const { Room } = require('../models');

exports.create = async (req, res) => {
    const { number } = req.body;

    try {
        await Room.create({
            number
        });

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