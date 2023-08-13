const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const decodedData = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    const { id, email } = decodedData;

    req.id = id;
    req.email = email;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ error: 'Authentication failure' });
  }
};

module.exports = authMiddleware;
