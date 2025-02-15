import { Hono } from "hono";
import * as userController from "@/Controllers/userController";

const userRoutes = new Hono();
userRoutes.post("/register", userController.userRegister);
userRoutes.post("/login", userController.userLogin);

userRoutes.use(userController.authMiddleware);
userRoutes.get("/getUsers", userController.getAllUsers);

export default userRoutes;
