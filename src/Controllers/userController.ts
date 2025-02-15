import { Context, Next } from "hono";
import User from "@/Models/userModel";
import AppError from "@/utils/AppError";
import * as jwt from "hono/jwt";

export async function getAllUsers(c: Context) {
  const { count, rows } = await User.findAndCountAll();
  if (rows.length == 0) {
    throw new AppError("No data found!", 404);
  }
  return c.json({
    totalCount: count,
    message: "success",
    users: rows,
  });
}

export async function userRegister(c: Context) {
  try {
    const body = await c.req.json();
    if (!body.name || !body.email || !body.password) {
      throw new AppError("Missing required fields", 400);
    }
    const existingUser = await User.findOne({
      where: { email: body.email },
      raw: true,
    });

    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }

    const hashedPassword = await Bun.password.hash(body.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const newUser = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });
    return c.json(newUser, 201);
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Failed to create user", 500);
  }
}

export async function userLogin(c: Context) {
  try {
    const body = await c.req.json();
    if (!body.email || !body.password) {
      throw new AppError("Missing required fields", 400);
    }
    const existingUser = await User.findOne({
      where: { email: body.email },
      raw: true,
    });

    if (!existingUser) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await Bun.password.verify(
      body.password,
      existingUser?.password
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }
    const token = await jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 5,
      },
      process.env.JWT_SECRET!!,
      "HS256"
    );

    return c.json(
      {
        message: "Login successful",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        },
        token,
      },
      201
    );
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Login Failed!", 500);
  }
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized access!", 401);
    }

    const token = authHeader.split(" ")[1];

    const payload = await jwt.verify(token, process.env.JWT_SECRET!, "HS256");

    if (!payload) {
      throw new AppError("Invalid token!", 403);
    }

    c.set("user", payload);

    return next();
  } catch (error: any) {
    throw new AppError(error.message || "Authentication failed!", 401);
  }
}
