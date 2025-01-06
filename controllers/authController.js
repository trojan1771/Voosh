const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const tokenBlacklist = new Set();

exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        // Check if token exists in the request header
        if (!token) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: null
            });
        }

        // Add token to blacklist
        tokenBlacklist.add(token);

        res.status(200).json({
            status: 200,
            data: null,
            message: 'User logged out successfully.',
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

// Middleware to check if a token is blacklisted
exports.isTokenBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};

exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request, Reason: Missing Field',
                error: null
            });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: 'Email already exists.',
                error: null
            });
        }

        // Determine if the first user should be an Admin
        const isFirstUser = (await User.countDocuments()) === 0;

        // Create a new user
        const user = new User({
            email,
            password,
            role: isFirstUser ? 'Admin' : 'Viewer' // First user is Admin, others are Viewer
        });

        await user.save();

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

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request, Reason: Missing Field',
                error: null
            });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null
            });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request, Reason: Incorrect password',
                error: null
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            status: 200,
            data: { token },
            message: 'Login successful.',
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