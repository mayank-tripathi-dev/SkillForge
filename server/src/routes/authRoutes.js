const express = require('express');
const { register, login, logout, getMe, updateProfile, becomeInstructor } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);
router.post('/become-instructor', requireAuth, becomeInstructor);

module.exports = router;

