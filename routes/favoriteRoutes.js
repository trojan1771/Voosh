const express = require('express');
const {
    getFavorites,
    addFavorite,
    removeFavorite
} = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:category', authMiddleware, getFavorites);
router.post('/add-favorite', authMiddleware, addFavorite);
router.delete('/remove-favorite/:id', authMiddleware, removeFavorite);

module.exports = router;
