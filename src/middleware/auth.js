const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication failed: No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded; next();
  } catch (_) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(403).json({ message: 'Forbidden: No user information found.' });
    const userRoles = req.user.roles;
    const userType = req.user.type;
    let isAuthorized = false;
    if (Array.isArray(userRoles) && userRoles.length > 0) {
      isAuthorized = userRoles.some((role) => allowedRoles.includes(role) || allowedRoles.includes(role?.name));
    } else if (userType) {
      isAuthorized = allowedRoles.includes(userType);
    }
    if (isAuthorized) return next();
    return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
  };
};

module.exports = { authenticate, authorize };

