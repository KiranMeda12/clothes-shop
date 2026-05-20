const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
  return next();
};

const isShopOwner = (req, res, next) => {
  if (req.user && (req.user.role === 'ShopOwner' || req.user.role === 'SuperAdmin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Shop owner only.' });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'SuperAdmin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Super Admin only.' });
  }
};

module.exports = { verifyToken, isShopOwner, isSuperAdmin };
