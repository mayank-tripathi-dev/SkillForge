const express = require('express');
const {
  getStudentDashboard,
  getCourseProgress,
  updateLessonProgress,
} = require('../controllers/studentController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard', getStudentDashboard);
router.get('/progress/:courseId', getCourseProgress);
router.post('/progress', updateLessonProgress);

module.exports = router;
