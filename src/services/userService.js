import { findAllUsers, findUserById } from "../data/userData.js";

function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

// Nunca devolver el password (ni siquiera hasheado)
function sanitizeUser(user) {
    const { password, ...rest } = user;
    return rest;
}

export async function listUsers() {
    const users = await findAllUsers();
    return users.map(sanitizeUser);
}

export async function getUserById(id) {
    const user = await findUserById(id);
    if (!user) {
        throw createHttpError(404, "Usuario no encontrado");
    }
    return sanitizeUser(user);
}
