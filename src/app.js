import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

// CORS significa Cross-Origin Resource Sharing (Intercambio de Recursos de Origen Cruzado).

const app = express();

// Middleware
app.use(morgan("dev")); // Loguea todas las peticiones HTTP en la consola
app.use(cors());
app.use(express.json());


// Ruta base
app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

// Rutas
app.use("/api/users", userRoutes);

export default app;