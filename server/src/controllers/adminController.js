const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc Get platform statistics for Admin
// @route GET /api/admin/dashboard
// @access Protected (Admin Only)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ published: true });

    const enrollments = await Enrollment.find();
    const totalEnrollments = enrollments.length;
    const totalPlatformRevenue = enrollments.reduce((sum, item) => sum + item.amount, 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        totalPlatformRevenue,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics.',
    });
  }
};

// @desc Get all registered users
// @route GET /api/admin/users
// @access Protected (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users list.',
    });
  }
};

// @desc Get all courses for Admin moderation
// @route GET /api/admin/courses
// @access Protected (Admin Only)
const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin course list.',
    });
  }
};

// @desc Change user role
// @route PUT /api/admin/users/:id/role
// @access Protected (Admin Only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['student', 'instructor', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user role.',
    });
  }
};

// @desc Delete user
// @route DELETE /api/admin/users/:id
// @access Protected (Admin Only)
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user.',
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllCoursesAdmin,
  updateUserRole,
  deleteUser,
};
