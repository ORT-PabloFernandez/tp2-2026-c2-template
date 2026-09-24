import { listUsers, getUserById,  registerUserService} from "../services/userService.js";

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

export async function registerUserController(req, res){
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({message: "Name, email y password son requeridos" });        
    }

    try {
        const result = await registerUserService({name, email, password});
        res.status(201).json({message: "Usuario registrado exitosamente", userId: result.insertedId})
    } catch (error) {
        if(error.message === "El email ya esta registrado") {
            return res.status(400).json({message: error.message});            
        }        
        console.error(error);
        res.status(500).json({message: "Error interno al registrar un usuario"});
    }
}
