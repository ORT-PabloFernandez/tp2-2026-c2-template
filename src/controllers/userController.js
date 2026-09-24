import { listUsers, getUserById } from "../services/userService.js";

function handleServiceError(error, res, next) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
}

export async function getUsers(req, res, next) {
    try {
        const users = await listUsers();
        res.status(200).json({ data: users });
    } catch (error) {
        handleServiceError(error, res, next);
    }
}

export async function getUser(req, res, next) {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        res.status(200).json({ data: user });
    } catch (error) {
        handleServiceError(error, res, next);
    }
}
