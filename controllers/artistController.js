const Artist = require('../models/Artist');

exports.getAllArtists = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5; // Default limit
        const offset = parseInt(req.query.offset) || 0; // Default offset
        const grammy = req.query.grammy; // Optional Grammy filter
        const hidden = req.query.hidden; // Optional visibility filter

        // Build query filter
        const filter = {};
        if (grammy) filter.grammy = parseInt(grammy);
        if (hidden !== undefined) filter.hidden = hidden === 'true';

        // Fetch artists with pagination
        const artists = await Artist.find(filter).skip(offset).limit(limit);

        res.status(200).json({
            status: 200,
            data: artists.map((artist) => ({
                artist_id: artist._id,
                name: artist.name,
                grammy: artist.grammy,
                hidden: artist.hidden,
            })),
            message: 'Artists retrieved successfully.',
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

exports.getArtistById = async (req, res) => {
    try {
        const artistId = req.params.id;

        // Validate artist ID format
        if (!artistId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid artist ID format'
            });
        }

        // Find artist by ID
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null
            });
        }

        res.status(200).json({
            status: 200,
            data: {
                artist_id: artist._id,
                name: artist.name,
                grammy: artist.grammy,
                hidden: artist.hidden,
            },
            message: 'Artist retrieved successfully.',
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

exports.addArtist = async (req, res) => {
    try {
        const { name, grammy, hidden } = req.body;

        // Validate input
        if (!name || grammy === undefined || hidden === undefined) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Missing required fields: name, grammy, or hidden'
            });
        }

        // Create new artist
        const artist = new Artist({ name, grammy, hidden });
        await artist.save();

        res.status(201).json({
            status: 201,
            data: null,
            message: 'Artist created successfully.',
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

exports.updateArtist = async (req, res) => {
    try {
        const artistId = req.params.id;

        // Validate artist ID format
        if (!artistId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid artist ID format'
            });
        }

        // Update artist fields
        const updates = req.body;
        const artist = await Artist.findByIdAndUpdate(artistId, updates, { new: true });

        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null
            });
        }

        res.status(204).send(); // No content
    } catch (err) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error',
            error: err.message
        });
    }
};

exports.deleteArtist = async (req, res) => {
    try {
        const artistId = req.params.id;

        // Validate artist ID format
        if (!artistId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid artist ID format'
            });
        }

        // Delete artist by ID
        const artist = await Artist.findByIdAndDelete(artistId);
        if (!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null
            });
        }

        res.status(200).json({
            status: 200,
            data: { artist_id: artist._id },
            message: `Artist: ${artist.name} deleted successfully.`,
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
