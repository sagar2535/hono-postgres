import { Context } from "hono";
import User from "../Models/userModel";
import AppError from "../utils/AppError";

export async function getAllUsers(c: Context) {
  try {
    const { count, rows } = await User.findAndCountAll();

    return c.json({
      totalCount: count,
      message: "success",
      users: rows,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function userRegister(c: Context) {
  try {
    const body = await c.req.json();
    if (!body.name || !body.email || !body.password) {
      throw new AppError("Missing required fields", 400);
    }
    const existingUser = await User.findOne({ where: { email: body.email } });
    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }

    const newUser = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    return c.json(newUser, 201);
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Failed to create user", 500);
  }
}
