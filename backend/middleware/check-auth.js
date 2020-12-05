// Check authentication middleware via web token
// a) is there a token
// b) validate token

const jwt = require('jsonwebtoken');

// Middleware from SCRATCH
module.exports = (req, res, next) => {
  // Check if token is in header
  try {
    // Check for a) and b)
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'example_secret_for_development_purpose');
    // Continue with request
    next();
  } catch (error) {
    res.status(401).json({message: "Auth failed!"});
  }
};
