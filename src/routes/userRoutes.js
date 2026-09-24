import express from "express";
import { getUsers, getUser, registerUserController } from "../controllers/userController.js";

const userRoutes = express.Router();

// GET /api/users
userRoutes.get("/", getUsers);

// GET /api/users/:id
userRoutes.get("/:id", getUser);
userRoutes.post("/register", registerUserController);


export default userRoutes;
