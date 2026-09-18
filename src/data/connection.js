import {MongoClient} from 'mongodb';
const uri = process.env.MONGODB_URI;

if(!uri) {
    throw new Error('MONGODB_URI no esta definida en las variables de entorno');
}

let client;
let db;

export async function connectToDatabase() {
    if(!client) {
        try {
            client = new MongoClient(uri);
            await client.connect();
            db = client.db("sample_tp2");
            console.log("Conexion a MongoDB establecida");
        } catch (error) {
            console.log("Error al conectarme con base de datos");
            throw error;
        }
    }
    return db;
}

export function getDb() {
    if(!db) {
        throw new Error("La conexion no esta abierta, LLamar a connectToDatabase primero");
    }
    return db;
}