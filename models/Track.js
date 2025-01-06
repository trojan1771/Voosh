const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    hidden: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Track', trackSchema);
