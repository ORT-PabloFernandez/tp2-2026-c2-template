import { ObjectId } from "mongodb";
import { getDb, connectToDatabase } from "./connection.js";

export async function findAllUsers() {
    await connectToDatabase();
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    return users;
}

export async function findUserById(id) {
    await connectToDatabase();
    const db = getDb();
    const oID = new ObjectId(id);
    const user = db.collection("users").findOne({_id: oID});
    return user;
}