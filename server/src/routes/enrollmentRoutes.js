const express = require('express');
const { enrollCourse, getMyEnrollments } = require('../controllers/enrollmentController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.post('/', enrollCourse);
router.get('/my-courses', getMyEnrollments);

module.exports = router;
