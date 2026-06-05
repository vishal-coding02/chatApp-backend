import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY as string;
const JWT_REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY as string;
import type { User, TokenPayload } from "../../interfaces/Jwt";

function generateToken(user: User) {
  const accessToken = jwt.sign(
    {
      id: user._id,
      name: user.userName,
    },
    JWT_ACCESS_SECRET_KEY,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    {
      id: user._id,
      name: user.userName,
    },
    JWT_REFRESH_SECRET_KEY,
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET_KEY);
    (req as any).user = decoded;
    (req as any).token = token;
    next();
  } catch (err: any) {
    console.log("Token error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function refreshToken(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET_KEY) as TokenPayload;
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

export {
  jwt,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  generateToken,
  verifyToken,
  refreshToken,
};
