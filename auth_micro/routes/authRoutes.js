import { Router } from "express";
import AuthController from "../controller/AuthController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = Router();


// Register route
router.post("/auth/register", AuthController.register);
// Login route
router.post("/auth/login", AuthController.login);
// Get user route
router.get("/auth/user", authMiddleware, AuthController.getUser);

export default router;