//import {getUsers, getUserById, createUser, updateUser, deleteUser} from "../services/userService.js";
export async function getUsers(req, res) {
    try {
        // Lógica para obtener todos los usuarios
        res.json({ message: "Obteniendo todos los usuarios" });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
}
