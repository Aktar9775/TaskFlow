import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { created, fail, ok } from "../utils/response.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { redis } from "../config/redis.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return fail(res, 400, "All fields are required");

    const exists = await User.findOne({ email });
    if (exists) return fail(res, 409, "Email already registered");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, passwordHash });

    return created(
      res,
      { id: user._id, name: user.name, email: user.email, role: user.role,name: user.name },
      "User registered successfully"
    );
  } catch (err) {
    return fail(res, 500, err.message);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return fail(res, 400, "Email and password required");

    const user = await User.findOne({ email });
    if (!user) return fail(res, 401, "Invalid credentials");

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return fail(res, 401, "Invalid credentials");

    const payload = { id: user._id, role: user.role, email: user.email, name: user.name };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // store refresh token in Redis (7 days)
    await redis.set(`refresh:${user._id}`, refreshToken, "EX", 60 * 60 * 24 * 7);

    return ok(res, { accessToken, refreshToken, user: payload }, "Login successful");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}

export async function refresh(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) return fail(res, 400, "userId required");

    const stored = await redis.get(`refresh:${userId}`);
    if (!stored) return fail(res, 401, "Refresh token not found");

    // new access token
    const user = await User.findById(userId);
    if (!user) return fail(res, 404, "User not found");

    const payload = { id: user._id, role: user.role, email: user.email , name: user.name};
    const accessToken = signAccessToken(payload);

    return ok(res, { accessToken }, "Token refreshed");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}

export async function logout(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) return fail(res, 400, "userId required");

    await redis.del(`refresh:${userId}`);
    return ok(res, null, "Logged out successfully");
  } catch (err) {
    return fail(res, 500, err.message);
  }
}
