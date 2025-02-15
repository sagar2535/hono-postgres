import { Hono } from "hono";
import * as userController from "@/Controllers/userController";

const router = new Hono();
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);

router.use(userController.authMiddleware);
router.get("/getUsers", userController.getAllUsers);

export default router;
