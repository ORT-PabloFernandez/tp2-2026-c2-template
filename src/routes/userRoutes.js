import express from "express";
import { getUsers, getUser, registerUserController, loginUserController } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const userRoutes = express.Router();

// GET /api/users
userRoutes.get("/",authMiddleware,  getUsers);

// GET /api/users/:id
userRoutes.get("/:id", getUser);
userRoutes.post("/register", registerUserController);
userRoutes.post("/login", loginUserController);


export default userRoutes;
