import { ObjectId } from "mongodb";
import { getDb } from "./connection.js";

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
