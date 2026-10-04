const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  getAllCoursesAdmin,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/dashboard', getAdminStats);
router.get('/users', getAllUsers);
router.get('/courses', getAllCoursesAdmin);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
