import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const issueTokens = (userId) => {
  const accessToken = generateAccessToken({ userId });

  const rawRefreshToken = generateRefreshToken();
  const hashedToken = hashToken(rawRefreshToken);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return {
    accessToken,
    rawRefreshToken,
    hashedToken,
    expiresAt,
  };
};