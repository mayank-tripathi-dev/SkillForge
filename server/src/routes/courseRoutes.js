const express = require('express');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', requireAuth, requireRole('instructor', 'admin'), createCourse);
router.put('/:id', requireAuth, requireRole('instructor', 'admin'), updateCourse);
router.delete('/:id', requireAuth, requireRole('instructor', 'admin'), deleteCourse);

module.exports = router;
