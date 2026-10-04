const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc Get Student Dashboard Overview
// @route GET /api/student/dashboard
// @access Protected
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ student: studentId }).populate('course');
    const progressRecords = await Progress.find({ student: studentId });

    const totalEnrolled = enrollments.length;
    let completedCourses = 0;
    let inProgressCourses = 0;

    progressRecords.forEach((p) => {
      if (p.completionPercentage === 100) {
        completedCourses += 1;
      } else if (p.completionPercentage > 0) {
        inProgressCourses += 1;
      }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalEnrolled,
        completedCourses,
        inProgressCourses,
      },
    });
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load student dashboard.',
    });
  }
};

// @desc Get progress for a specific course
// @route GET /api/student/progress/:courseId
// @access Protected
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    let progress = await Progress.findOne({ student: studentId, course: courseId });

    if (!progress) {
      // Create default progress if enrolled
      const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'You are not enrolled in this course.',
        });
      }

      progress = await Progress.create({
        student: studentId,
        course: courseId,
        completedLessons: [],
        completionPercentage: 0,
      });
    }

    return res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch course progress.',
    });
  }
};

// @desc Mark lesson completed or uncompleted and update percentage
// @route POST /api/student/progress
// @access Protected
const updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId, completed } = req.body;
    const studentId = req.user._id;

    if (!courseId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and Lesson ID are required.',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    let progress = await Progress.findOne({ student: studentId, course: courseId });
    if (!progress) {
      progress = await Progress.create({
        student: studentId,
        course: courseId,
        completedLessons: [],
        completionPercentage: 0,
      });
    }

    // Calculate total lessons in course
    let totalLessons = 0;
    course.sections.forEach((sec) => {
      totalLessons += sec.lessons ? sec.lessons.length : 0;
    });

    if (totalLessons === 0) totalLessons = 1; // Prevent division by zero

    let updatedCompletedLessons = [...progress.completedLessons];

    if (completed !== false) {
      // Mark as completed
      if (!updatedCompletedLessons.includes(lessonId)) {
        updatedCompletedLessons.push(lessonId);
      }
    } else {
      // Unmark completed
      updatedCompletedLessons = updatedCompletedLessons.filter((id) => id !== lessonId);
    }

    const completionPercentage = Math.round(
      (updatedCompletedLessons.length / totalLessons) * 100
    );

    progress.completedLessons = updatedCompletedLessons;
    progress.completionPercentage = Math.min(100, completionPercentage);
    progress.lastAccessedLesson = lessonId;

    await progress.save();

    return res.status(200).json({
      success: true,
      message: 'Lesson progress updated successfully.',
      progress,
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update progress.',
    });
  }
};

module.exports = {
  getStudentDashboard,
  getCourseProgress,
  updateLessonProgress,
};
