const jwt = require('jsonwebtoken');

const authMiddleware = {
  requireAuth: (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  },

  requireRole: (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  },
};

module.exports = authMiddleware;

