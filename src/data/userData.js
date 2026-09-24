import { ObjectId } from "mongodb";
import { connectToDatabase, getDb } from "./connection.js";
import bcrypt from "bcrypt";

function getCollection() {
    return getDb().collection("users");
}

// Convierte el documento de Mongo ({ _id, ... }) al formato que usa la app ({ id, ... })
function mapUser(doc) {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
}

// Devuelve null si el id no es un ObjectId válido (24 caracteres hex)
function toObjectId(id) {
    return ObjectId.isValid(id) && String(id).length === 24 ? new ObjectId(id) : null;
}

export async function findAllUsers() {
    const users = await getCollection().find().toArray();
    return users.map(mapUser);
}

export async function findUserById(id) {
    const _id = toObjectId(id);
    if (!_id) return null;
    const user = await getCollection().findOne({ _id });
    return mapUser(user);
}

export async function registerUser({name, email, password}) {
    await connectToDatabase();
    const db = getDb();

    // verificar si el email ya existe
    const existingUser = await db.collection('users').findOne({email});

    if(existingUser) {
        throw new Error("El email ya esta registrado");        
    }

    // hacer el hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
        name, 
        email, 
        password: hashedPassword
    };

    console.log("Nuevo usuario a registrar", newUser);
    const result = await db.collection("users").insertOne(newUser);

    return result;
}

export async function findByCredentials(email, password) {
    await connectToDatabase();
    const db = getDb();
    const user = await db.collection("users").findOne({email});
    if(!user) {
        // no encontro el email
        return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        // password no coincide
        return null;
    }

    return user;
}
