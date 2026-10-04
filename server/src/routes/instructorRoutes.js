const express = require('express');
const {
  getInstructorDashboard,
  getInstructorCourses,
} = require('../controllers/instructorController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('instructor', 'admin'));

router.get('/dashboard', getInstructorDashboard);
router.get('/courses', getInstructorCourses);

module.exports = router;
