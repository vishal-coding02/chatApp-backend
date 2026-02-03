const jwt = require("jsonwebtoken");
const JWT_ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

function generateToken(user) {
  const accessToken = jwt.sign(
    {
      id: user._id,
      name: user.userName,
    },
    JWT_ACCESS_SECRET_KEY,
    { expiresIn: "15m" },
  );
  console.log(accessToken);
  const refreshToken = jwt.sign(
    {
      id: user._id,
      name: user.userName,
    },
    JWT_REFRESH_SECRET_KEY,
    { expiresIn: "1d" },
  );
  console.log(refreshToken);

  return { accessToken, refreshToken };
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Auth header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET_KEY);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    console.log("Token error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function refreshToken(req, res) {
  const token = req.cookies.refreshToken;
  console.log(token);
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET_KEY);
    const newAccessToken = jwt.sign(
      {
        id: payload.id,
        name: payload.name,
      },
      JWT_ACCESS_SECRET_KEY,
      { expiresIn: "15m" },
    );
    res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
}

module.exports = {
  jwt,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  generateToken,
  verifyToken,
  refreshToken,
};
