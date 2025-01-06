const Favorite = require('../models/Favorite');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Track = require('../models/Track');

exports.getFavorites = async (req, res) => {
    try {
        const { category } = req.params;
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;

        // Validate category
        if (!['artist', 'album', 'track'].includes(category)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid category'
            });
        }

        const favorites = await Favorite.find({ user: req.user.id, category })
            .skip(offset)
            .limit(limit)
            .populate(category, 'name') // Populate category-specific data
            .select('-user');

        res.status(200).json({
            status: 200,
            data: favorites.map(fav => ({
                favorite_id: fav._id,
                category: fav.category,
                item_id: fav[category]._id,
                name: fav[category].name,
                created_at: fav.createdAt,
            })),
            message: 'Favorites retrieved successfully.',
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

exports.addFavorite = async (req, res) => {
    try {
        const { category, item_id } = req.body;

        // Validate category
        if (!['artist', 'album', 'track'].includes(category)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid category'
            });
        }

        // Check if the item exists in the database
        const Model = category === 'artist' ? Artist : category === 'album' ? Album : Track;
        const item = await Model.findById(item_id);
        if (!item) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Resource not found.',
                error: null
            });
        }

        // Check if the favorite already exists
        const existingFavorite = await Favorite.findOne({ user: req.user.id, category, [category]: item_id });
        if (existingFavorite) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Favorite already exists'
            });
        }

        // Create the favorite
        const favorite = new Favorite({
            user: req.user.id,
            category,
            [category]: item_id,
        });

        await favorite.save();

        res.status(201).json({
            status: 201,
            data: null,
            message: 'Favorite added successfully.',
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

exports.removeFavorite = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate favorite ID
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid favorite ID format'
            });
        }

        // Find and delete the favorite
        const favorite = await Favorite.findOneAndDelete({ _id: id, user: req.user.id });
        if (!favorite) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Favorite not found.',
                error: null
            });
        }

        res.status(200).json({
            status: 200,
            data: null,
            message: 'Favorite removed successfully.',
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
