const express = require('express');
const {
    getAllUsers,
    addUser,
    deleteUser,
    updatePassword
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['Admin']), getAllUsers);
router.post('/add-user', authMiddleware, roleMiddleware(['Admin']), addUser);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteUser);
router.put('/update-password', authMiddleware, updatePassword);

module.exports = router;
