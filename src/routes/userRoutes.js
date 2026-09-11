import express from "express";
import { getUsers } from "../controllers/userController.js";

const userRoutes = express.Router();

// GET /api/users
// userRoutes.get("/", (req, res) => {
//     res.json({ message: "Obteniendo todos los usuarios" });
// });

userRoutes.get("/", getUsers); 

userRoutes.get("/:id", (req, res) => {
    const { id } = req.params;
    res.json({ message: `Obteniendo el usuario con ID: ${id}` });
});

userRoutes.post("/", (req, res) => {
    const { name, email } = req.body;
    res.json({ message: `Creando un nuevo usuario con nombre: ${name} y email: ${email}` });
});

userRoutes.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    res.json({ message: `Actualizando el usuario con ID: ${id}, nuevo nombre: ${name}, nuevo email: ${email}` });
});

userRoutes.delete("/:id", (req, res) => {
    const { id } = req.params;
    res.json({ message: `Eliminando el usuario con ID: ${id}` });
});

export default userRoutes;
