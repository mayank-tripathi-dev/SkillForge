const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      // Session exists for deleted user
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'User session invalid or expired.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication check failed.',
    });
  }
};

module.exports = { requireAuth };
