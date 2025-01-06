const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', authMiddleware, logout); // Logout endpoint

module.exports = router;
