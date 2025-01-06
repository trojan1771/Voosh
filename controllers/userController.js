const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        // Ensure the user is an Admin
        if (req.user.role !== 'Admin') {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unauthorized Access',
                error: null
            });
        }

        // Extract query parameters
        const limit = parseInt(req.query.limit) || 5; // Default limit
        const offset = parseInt(req.query.offset) || 0; // Default offset
        const role = req.query.role; // Optional role filter

        // Build query filter
        const filter = role ? { role } : {};

        // Fetch users with pagination
        const users = await User.find(filter)
            .skip(offset)
            .limit(limit)
            .select('-password'); // Exclude passwords

        res.status(200).json({
            status: 200,
            data: users.map((user) => ({
                user_id: user._id,
                email: user.email,
                role: user.role,
                created_at: user.createdAt,
            })),
            message: 'Users retrieved successfully.',
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


exports.addUser = async (req, res) => {
    try {
        // Ensure the request is made by an Admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden Access/Operation not allowed.',
                error: null
            });
        }

        const { email, password, role } = req.body;

        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Missing required fields: email, password, or role'
            });
        }

        // Ensure role is either "Editor" or "Viewer"
        if (!['Editor', 'Viewer'].includes(role)) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden Access/Operation not allowed.',
                error: null
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: 'Email already exists.',
                error: null
            });
        }

        // Create new user
        const newUser = new User({ email, password, role });
        await newUser.save();

        res.status(201).json({
            status: 201,
            data: null,
            message: 'User created successfully.',
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

exports.deleteUser = async (req, res) => {
    try {
        // Ensure the request is made by an Admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden Access',
                error: null
            });
        }

        const userId = req.params.id;

        // Validate user ID
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Invalid user ID format'
            });
        }

        // Attempt to delete the user
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null
            });
        }

        res.status(200).json({
            status: 200,
            data: null,
            message: 'User deleted successfully.',
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

const bcrypt = require('bcryptjs');

exports.updatePassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        // Validate input
        if (!old_password || !new_password) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Missing required fields: old_password or new_password'
            });
        }

        // Find the user by ID
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null
            });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Old password is incorrect.',
                error: null
            });
        }

        // Hash and update new password
        user.password = await bcrypt.hash(new_password, 10);
        await user.save();

        res.status(204).json({message:"Password updated"}); // No content
    } catch (err) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error',
            error: err.message
        });
    }
};
