import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  let token;

  const authHeader = req.header('Authorization');
  console.log("Auth Middleware: Authorization Header ->", authHeader); // Debugging

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    console.warn("Auth Middleware: No token provided.");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    console.log("Auth Middleware: Received Token ->", token); // Debugging

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth Middleware: Token Decoded ->", decoded); // Debugging

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token. Authentication failed." });
    }

    res.status(500).json({ error: "Authentication error. Please try again." });
  }
};

export default authMiddleware;
