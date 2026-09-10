# Responsabilidades por capa

Este backend está organizado en capas simples para mantener el código claro y fácil de mantener.

## 1) Routes (`src/routes`)

Responsabilidad:
- Definir endpoints y métodos HTTP.
- Conectar cada endpoint con su controller.
- Aplicar middlewares de entrada (por ejemplo, auth).

No debería hacer:
- Lógica de negocio.
- Acceso a base de datos.

Ejemplos:
- `userRoutes.js`: endpoints de recurso usuario (`GET /api/users`, `GET /api/users/:id`).
- `authRoutes.js`: endpoints de autenticación (`POST /api/auth/register`, `POST /api/auth/login`).

## 2) Controllers (`src/controllers`)

Responsabilidad:
- Recibir `req` y construir `res`.
- Validar campos mínimos de entrada.
- Traducir errores esperados a códigos HTTP (`400`, `401`, `404`, `409`).
- Delegar trabajo de negocio al service.

No debería hacer:
- Consultas directas a Mongo.
- Reglas complejas de dominio.

Ejemplo:
- `userController.js` valida body, llama a service y responde JSON.

## 3) Services (`src/services`)

Responsabilidad:
- Implementar reglas de negocio.
- Orquestar llamadas a la capa data.
- Transformar/sanitizar datos de salida (por ejemplo, ocultar `password`).

No debería hacer:
- Manejar detalles HTTP (status codes, req/res).
- Conocer detalles de Express.

Ejemplo:
- `userService.js` sanitiza usuario y valida credenciales.

## 4) Data / Repository (`src/data`)

Responsabilidad:
- Hablar con MongoDB.
- Ejecutar queries (`find`, `findOne`, `insertOne`).
- Validaciones técnicas de persistencia (ejemplo: `ObjectId` válido).

No debería hacer:
- Responder HTTP.
- Lógica de negocio de alto nivel.

Ejemplos:
- `userData.js` para queries de usuarios.
- `connection.js` para conexión y acceso a `db`.

## 5) Middleware (`src/middleware` y `src/app.js`)

Responsabilidad:
- Lógica transversal reutilizable.
- Auth por token (`authMiddleware`).
- Manejo global de 404 y errores en `app.js`.

## Flujo recomendado

`Route -> Controller -> Service -> Data -> MongoDB`

y de vuelta:

`MongoDB -> Data -> Service -> Controller -> Response`

## Reglas prácticas para mantenerlo simple

- Si toca `req/res`, va en controller o middleware.
- Si toca reglas de negocio, va en service.
- Si toca Mongo, va en data.
- Si solo conecta endpoint + middleware, va en routes.
- Evitar saltar capas (por ejemplo controller -> data directo).
