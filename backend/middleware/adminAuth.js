const jwt = require('jsonwebtoken');

const adminProtect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Admin access denied: No authorization token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eventora_secret_2026');
    if (decoded.role !== 'admin' || decoded.email !== (process.env.ADMIN_EMAIL || 'admin@eventpro.com')) {
      return res.status(403).json({
        success: false,
        message: 'Admin access denied: Insufficient privileges'
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Admin access token is invalid or expired'
    });
  }
};

module.exports = { adminProtect };
