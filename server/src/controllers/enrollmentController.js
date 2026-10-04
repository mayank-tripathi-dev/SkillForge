const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

// @desc Enroll student in a course (Supports free & demo paid checkout)
// @route POST /api/enrollments
// @access Protected (Student, Instructor, Admin)
const enrollCourse = async (req, res) => {
  try {
    const { courseId, paymentMethod } = req.body;
    const studentId = req.user._id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required.',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Check existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course.',
      });
    }

    // Create Enrollment Record
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      amount: course.price,
      paymentStatus: 'completed',
      paymentMethod: paymentMethod || 'demo_checkout',
    });

    // Initialize Progress Record
    let progress = await Progress.findOne({ student: studentId, course: courseId });
    if (!progress) {
      progress = await Progress.create({
        student: studentId,
        course: courseId,
        completedLessons: [],
        completionPercentage: 0,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course!',
      enrollment,
      progress,
    });
  } catch (error) {
    console.error('Error during enrollment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Enrollment failed.',
    });
  }
};

// @desc Get student's enrolled courses with progress
// @route GET /api/enrollments/my-courses
// @access Protected
const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name profileImage' },
      })
      .sort({ enrolledAt: -1 });

    // Fetch corresponding progress for each enrolled course
    const courseIds = enrollments.map((e) => e.course ? e.course._id : null).filter(Boolean);
    const progressRecords = await Progress.find({
      student: studentId,
      course: { $in: courseIds },
    });

    const progressMap = {};
    progressRecords.forEach((p) => {
      progressMap[p.course.toString()] = p;
    });

    const enrichedEnrollments = enrollments.map((e) => {
      const cId = e.course ? e.course._id.toString() : null;
      return {
        _id: e._id,
        course: e.course,
        enrolledAt: e.enrolledAt,
        amount: e.amount,
        progress: progressMap[cId] || {
          completedLessons: [],
          completionPercentage: 0,
        },
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedEnrollments.length,
      enrollments: enrichedEnrollments,
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled courses.',
    });
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
};
