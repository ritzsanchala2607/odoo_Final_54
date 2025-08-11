const jwt = require('jsonwebtoken');

const authMiddleware = {
  requireAuth: (req, res, next) => {
    try {
      // First check session
      if (req.session && req.session.isAuthenticated) {
        req.user = {
          id: req.session.userId,
          role: req.session.userRole,
          email: req.session.userEmail
        };
        return next();
      }
      
      // Check for JWT token in cookies
      let token = req.cookies.jwt_token;
      
      // Fallback to Authorization header
      if (!token) {
        const header = req.headers.authorization || '';
        token = header.startsWith('Bearer ') ? header.slice(7) : null;
      }
      
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
      
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      req.user = payload;
      
      // Update session with JWT data
      if (req.session) {
        req.session.userId = payload.id;
        req.session.userRole = payload.role;
        req.session.userEmail = payload.email;
        req.session.isAuthenticated = true;
      }
      
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

