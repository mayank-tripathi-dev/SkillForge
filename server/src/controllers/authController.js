const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc Register user
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default role validation
    const validRoles = ['student', 'instructor', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'student';

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: userRole,
    });

    // Create session
    req.session.userId = user._id.toString();
    req.session.role = user.role;

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.',
    });
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Set Session
    req.session.userId = user._id.toString();
    req.session.role = user.role;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
};

// @desc Logout user & destroy session
// @route POST /api/auth/logout
// @access Protected
const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not log out. Please try again.',
      });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  });
};

// @desc Get current authenticated user session
// @route GET /api/auth/me
// @access Protected
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profileImage: req.user.profileImage,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
    });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Protected
const updateProfile = async (req, res) => {
  try {
    const { name, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating profile.',
    });
  }
};

// @desc Upgrade current user to Instructor role
// @route POST /api/auth/become-instructor
// @access Protected
const becomeInstructor = async (req, res) => {
  try {
    const { bio, expertise } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.role = 'instructor';
    await user.save();

    // Update Session
    req.session.role = 'instructor';

    return res.status(200).json({
      success: true,
      message: 'Congratulations! Your account has been upgraded to Instructor.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Become instructor error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process instructor upgrade.',
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  becomeInstructor,
};

