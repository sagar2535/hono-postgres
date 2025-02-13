import { Hono } from "hono";
import * as userController from "@/Controllers/userController";

const userRoutes = new Hono();

userRoutes.get("/", userController.getAllUsers);
userRoutes.post("/create", userController.userRegister);

export default userRoutes;
