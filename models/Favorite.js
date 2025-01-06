const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['artist', 'album', 'track'], required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    track: { type: mongoose.Schema.Types.ObjectId, ref: 'Track' },
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
