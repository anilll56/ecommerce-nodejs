const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error: Missing configuration',
    });
  }

  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header is missing or invalid',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { userId: decoded.id };
    next();
  } catch (error) {
    const isExpired = error.name === 'TokenExpiredError';
    res.status(401).json({
      success: false,
      message: isExpired ? 'Token has expired' : 'Token is not valid',
    });
  }
};

module.exports = { auth };
