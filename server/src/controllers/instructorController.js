const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc Get Instructor Dashboard Overview
// @route GET /api/instructor/dashboard
// @access Protected (Instructor, Admin)
const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Get all courses by this instructor
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map((c) => c._id);

    // Get all enrollments for these courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } }).populate(
      'student',
      'name email profileImage'
    );

    const totalCourses = courses.length;
    const totalStudents = enrollments.length;
    const totalRevenue = enrollments.reduce((sum, item) => sum + item.amount, 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalRevenue,
      },
      recentEnrollments: enrollments.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching instructor dashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load instructor dashboard.',
    });
  }
};

// @desc Get courses created by the logged-in instructor
// @route GET /api/instructor/courses
// @access Protected (Instructor, Admin)
const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const courses = await Course.find({ instructor: instructorId }).sort({ createdAt: -1 });

    // Aggregate student counts for each course
    const courseIds = courses.map((c) => c._id);
    const enrollments = await Enrollment.find({ course: { $in: courseIds } });

    const studentCountMap = {};
    enrollments.forEach((e) => {
      const cId = e.course.toString();
      studentCountMap[cId] = (studentCountMap[cId] || 0) + 1;
    });

    const enrichedCourses = courses.map((c) => {
      const cObj = c.toObject();
      cObj.enrolledStudentsCount = studentCountMap[c._id.toString()] || 0;
      return cObj;
    });

    return res.status(200).json({
      success: true,
      count: enrichedCourses.length,
      courses: enrichedCourses,
    });
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load instructor courses.',
    });
  }
};

module.exports = {
  getInstructorDashboard,
  getInstructorCourses,
};
