const Album = require('../models/Album');
const Artist = require('../models/Artist');

exports.getAllAlbums = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5; // Default limit
        const offset = parseInt(req.query.offset) || 0; // Default offset
        const artistId = req.query.artist_id; // Filter by artist ID
        const hidden = req.query.hidden; // Filter by visibility

        const filter = {};
        if (artistId) filter.artist = artistId;
        if (hidden !== undefined) filter.hidden = hidden === 'true';

        const albums = await Album.find(filter)
            .populate('artist', 'name') // Populate artist name
            .skip(offset)
            .limit(limit);

        res.status(200).json({
            status: 200,
            data: albums.map(album => ({
                album_id: album._id,
                artist_name: album.artist.name,
                name: album.name,
                year: album.year,
                hidden: album.hidden,
            })),
            message: 'Albums retrieved successfully.',
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

exports.getAlbumById = async (req, res) => {
    try {
        const albumId = req.params.id;

        if (!albumId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid album ID format'
            });
        }

        const album = await Album.findById(albumId).populate('artist', 'name');
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found.',
                error: null
            });
        }

        res.status(200).json({
            status: 200,
            data: {
                album_id: album._id,
                artist_name: album.artist.name,
                name: album.name,
                year: album.year,
                hidden: album.hidden,
            },
            message: 'Album retrieved successfully.',
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

exports.addAlbum = async (req, res) => {
    try {
        const { artist_id, name, year, hidden } = req.body;

        if (!artist_id || !name || year === undefined || hidden === undefined) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Missing required fields: artist_id, name, year, or hidden'
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

        const album = new Album({ artist: artist_id, name, year, hidden });
        await album.save();

        res.status(201).json({
            status: 201,
            data: null,
            message: 'Album created successfully.',
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

exports.updateAlbum = async (req, res) => {
    try {
        const albumId = req.params.id;

        if (!albumId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid album ID format'
            });
        }

        const updates = req.body;
        const album = await Album.findByIdAndUpdate(albumId, updates, { new: true });

        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found.',
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

exports.deleteAlbum = async (req, res) => {
    try {
        const albumId = req.params.id;

        if (!albumId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid album ID format'
            });
        }

        const album = await Album.findByIdAndDelete(albumId);
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found.',
                error: null
            });
        }

        res.status(200).json({
            status: 200,
            data: null,
            message: `Album: ${album.name} deleted successfully.`,
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
