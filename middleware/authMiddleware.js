const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../controllers/authController');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    // Check if the token is blacklisted
    if (isTokenBlacklisted(token)) {
        return res.status(401).json({ message: 'Token is invalid or expired. Please log in again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

module.exports = authMiddleware;
