const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc Get all courses with search, filter, and sorting
// @route GET /api/courses
// @access Public
const getAllCourses = async (req, res) => {
  try {
    const { category, level, price, search, sort } = req.query;

    const filter = { published: true };

    // Category filter
    if (category && category !== 'All') {
      const categoriesArray = category.split(',').map((c) => c.trim());
      filter.category = { $in: categoriesArray };
    }

    // Level filter
    if (level && level !== 'All') {
      const levelsArray = level.split(',').map((l) => l.trim());
      filter.level = { $in: levelsArray };
    }

    // Price filter
    if (price === 'free') {
      filter.price = 0;
    } else if (price === 'paid') {
      filter.price = { $gt: 0 };
    }

    // Search query (title, description)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    // Sort options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'popular') {
      sortOptions = { ratingCount: -1, rating: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'name profileImage email')
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch courses.',
    });
  }
};

// @desc Get single course details by ID
// @route GET /api/courses/:id
// @access Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'name profileImage email role'
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Check if current user is enrolled (if user session exists)
    let isEnrolled = false;
    if (req.session && req.session.userId) {
      const enrollment = await Enrollment.findOne({
        student: req.session.userId,
        course: course._id,
      });
      if (enrollment) isEnrolled = true;
    }

    return res.status(200).json({
      success: true,
      course,
      isEnrolled,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch course details.',
    });
  }
};

// @desc Create new course (Instructor/Admin)
// @route POST /api/courses
// @access Protected (Instructor, Admin)
const createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail, category, level, badge, sections } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and price are required.',
      });
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      category: category || 'Development',
      level: level || 'Intermediate',
      badge: badge || 'New',
      instructor: req.user._id,
      sections: sections || [],
      published: true,
    });

    const populatedCourse = await course.populate('instructor', 'name profileImage email');

    return res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      course: populatedCourse,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create course.',
    });
  }
};

// @desc Update course
// @route PUT /api/courses/:id
// @access Protected (Owner Instructor, Admin)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Ownership check
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this course.',
      });
    }

    const { title, description, price, thumbnail, category, level, badge, published, sections } = req.body;

    if (title) course.title = title.trim();
    if (description) course.description = description.trim();
    if (price !== undefined) course.price = Number(price);
    if (thumbnail) course.thumbnail = thumbnail;
    if (category) course.category = category;
    if (level) course.level = level;
    if (badge) course.badge = badge;
    if (published !== undefined) course.published = published;
    if (sections) course.sections = sections;

    await course.save();

    const updatedCourse = await course.populate('instructor', 'name profileImage email');

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update course.',
    });
  }
};

// @desc Delete course
// @route DELETE /api/courses/:id
// @access Protected (Owner Instructor, Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Ownership check
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this course.',
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete course.',
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
