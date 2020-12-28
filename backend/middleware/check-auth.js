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
    const decodedToken = jwt.verify(token, 'example_secret_for_development_purpose');
    // All middlewares running this check will recieve this userdata
    req.userData = {email: decodedToken.email, userId: decodedToken.userId}
    // Continue with request
    next();
  } catch (error) {
    res.status(401).json({message: "You are not authenticated."});
  }
};
