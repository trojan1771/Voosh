const Track = require('../models/Track');
const Artist = require('../models/Artist');
const Album = require('../models/Album');

exports.getAllTracks = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5; // Default limit
        const offset = parseInt(req.query.offset) || 0; // Default offset
        const artistId = req.query.artist_id; // Optional artist filter
        const albumId = req.query.album_id; // Optional album filter
        const hidden = req.query.hidden; // Optional visibility filter

        // Build query filter
        const filter = {};
        if (artistId) filter.artist = artistId;
        if (albumId) filter.album = albumId;
        if (hidden !== undefined) filter.hidden = hidden === 'true';

        const tracks = await Track.find(filter)
            .populate('artist', 'name') // Populate artist name
            .populate('album', 'name') // Populate album name
            .skip(offset)
            .limit(limit);

        res.status(200).json({
            status: 200,
            data: tracks.map(track => ({
                track_id: track._id,
                artist_name: track.artist.name,
                album_name: track.album.name,
                name: track.name,
                duration: track.duration,
                hidden: track.hidden,
            })),
            message: 'Tracks retrieved successfully.',
            error: null
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request',
            error: err.message
        });
    }
};

exports.getTrackById = async (req, res) => {
    try {
        const trackId = req.params.id;

        if (!trackId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid track ID format'
            });
        }

        const track = await Track.findById(trackId)
            .populate('artist', 'name')
            .populate('album', 'name');

        if (!track) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Track not found.',
                error: null
            });
        }

        res.status(200).json({
            status: 200,
            data: {
                track_id: track._id,
                artist_name: track.artist.name,
                album_name: track.album.name,
                name: track.name,
                duration: track.duration,
                hidden: track.hidden,
            },
            message: 'Track retrieved successfully.',
            error: null
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error',
            error: err.message
        });
    }
};

exports.addTrack = async (req, res) => {
    try {
        const { artist_id, album_id, name, duration, hidden } = req.body;

        if (!artist_id || !album_id || !name || duration === undefined || hidden === undefined) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Missing required fields: artist_id, album_id, name, duration, or hidden'
            });
        }

        const artist = await Artist.findById(artist_id);
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null
            });
        }

        const album = await Album.findById(album_id);
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found.',
                error: null
            });
        }

        const track = new Track({ artist: artist_id, album: album_id, name, duration, hidden });
        await track.save();

        res.status(201).json({
            status: 201,
            data: null,
            message: 'Track created successfully.',
            error: null
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error',
            error: err.message
        });
    }
};

exports.updateTrack = async (req, res) => {
    try {
        const trackId = req.params.id;

        if (!trackId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid track ID format'
            });
        }

        const updates = req.body;
        const track = await Track.findByIdAndUpdate(trackId, updates, { new: true });

        if (!track) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Track not found.',
                error: null
            });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error',
            error: err.message
        });
    }
};

exports.deleteTrack = async (req, res) => {
    try {
        const trackId = req.params.id;

        if (!trackId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid track ID format'
            });
        }

        const track = await Track.findByIdAndDelete(trackId);
        if (!track) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Track not found.',
                error: null
            });
        }

        res.status(200).json({
            status: 200,
            data: null,
            message: `Track: ${track.name} deleted successfully.`,
            error: null
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error',
            error: err.message
        });
    }
};
