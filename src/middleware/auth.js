const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      if (required) return res.status(401).json({ message: 'Unauthorized' });
      return next();
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = payload; return next();
    } catch (err) { return res.status(401).json({ message: 'Invalid token' }); }
  };
}

function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const roles = req.user.roles || [];
    const ok = roles.some((r) => allowedRoles.includes(r) || allowedRoles.includes(r?.name));
    if (!ok) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

function requirePermissions(...perms) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userPerms = req.user.permissions || [];
    const ok = perms.every((p) => userPerms.includes(p));
    if (!ok) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { auth, requireRoles, requirePermissions };

