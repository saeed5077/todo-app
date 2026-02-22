const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; // extract token after "Bearer "
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: 'userId', iat: ..., exp: ... }

    const user1 = await User.findById(decoded.id).select('-password');
    console.log(user1);
    req.user = await User.findById(decoded.id).select('-password');

    // 5. Move on to the actual route handler
    next();

  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };