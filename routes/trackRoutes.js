const express = require('express');
const {
    getAllTracks,
    getTrackById,
    addTrack,
    updateTrack,
    deleteTrack
} = require('../controllers/trackController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAllTracks);
router.get('/:id', authMiddleware, getTrackById);
router.post('/add-track', authMiddleware, addTrack);
router.put('/:id', authMiddleware, updateTrack);
router.delete('/:id', authMiddleware, deleteTrack);

module.exports = router;
