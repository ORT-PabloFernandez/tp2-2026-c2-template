import "dotenv/config";
import app from "./src/app.js";
import { connectToDatabase } from "./src/data/connection.js";


const PORT = process.env.PORT || 3000;


async function startServer() {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log("Servidor escuchando en el puerto " + PORT);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);  
        process.exit(1);
    }
}

startServer();
