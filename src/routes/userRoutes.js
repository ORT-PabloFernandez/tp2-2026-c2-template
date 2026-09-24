import express from "express";
import { getUsers, getUser } from "../controllers/userController.js";

const userRoutes = express.Router();

// GET /api/users
userRoutes.get("/", getUsers);

// GET /api/users/:id
userRoutes.get("/:id", getUser);

export default userRoutes;
