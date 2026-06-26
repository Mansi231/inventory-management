// Middleware factory — pass allowed roles as arguments
// Usage: requireRole('admin')  or  requireRole('admin', 'staff')
const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}.`,
    });
  }
  next();
};

module.exports = requireRole;
