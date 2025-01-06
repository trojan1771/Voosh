const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    year: { type: Number },
    hidden: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
