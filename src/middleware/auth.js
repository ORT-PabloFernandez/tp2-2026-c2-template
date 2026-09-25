import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log(req.headers);
    console.log(authHeader);
    // Bearer token
    if( !authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Token de autenticacion faltante o mal formado"});
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        // si todo esta bien, entonces lo dejo pasar
        next();
    } catch (error) {
        console.error("Error en auth", error);
        return res.status(401).json({message: "Token de autenticacion invalido"});
    }
}