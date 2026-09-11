# Ejercicio: CRUD REST de Productos de Computación (Mock JSON)

## Objetivo

Implementar una API REST en Express para gestionar un catálogo de productos de computación, utilizando un **JSON inventado en memoria** (sin base de datos).

Deben replicar la misma lógica y organización en capas que ya se usó para `Users`, pero aplicada al recurso `Products`.

## Alcance

- No se utiliza base de datos: los datos viven en memoria dentro de la capa `data`.
- El estado se reinicia cada vez que se reinicia el servidor (esperado).
- Se valoran: organización por capas, uso correcto de verbos HTTP y códigos de estado.

## Estructura por capas esperada

- `src/routes/productRoutes.js` → define endpoints REST.
- `src/controllers/productController.js` → maneja `req/res` y códigos HTTP.
- `src/services/productService.js` → lógica de negocio y validaciones de dominio.
- `src/data/productData.js` → acceso al JSON en memoria.

Montar el router en `src/app.js` bajo el path:

```
/api/products
```

## Modelo del recurso

Cada producto debe tener al menos:

- `id` (string)
- `name` (string)
- `brand` (string)
- `category` (string, ej: `notebook`, `monitor`, `teclado`, `mouse`, `gpu`, `ram`, `almacenamiento`)
- `price` (number, > 0)
- `stock` (integer, >= 0)

## Endpoints obligatorios

- `GET /api/products` → listar todos los productos.
- `GET /api/products/:id` → obtener un producto por `id`.
- `POST /api/products` → crear un producto nuevo.
- `PUT /api/products/:id` → reemplazar un producto existente.
- `DELETE /api/products/:id` → eliminar un producto.

### Opcional (puntos extra)

- `GET /api/products?category=notebook` → filtrar por categoría.
- `GET /api/products?brand=Logitech` → filtrar por marca.

## Validaciones mínimas

- En `POST` y `PUT`:
  - Todos los campos obligatorios deben estar presentes.
  - `price` debe ser numérico y mayor a 0.
  - `stock` debe ser entero y mayor o igual a 0.
- Si el `id` no existe en `GET/:id`, `PUT/:id` o `DELETE/:id` → responder `404`.
- Si el body es inválido en `POST` o `PUT` → responder `400`.
- No se permiten `name` vacíos ni solo espacios.

## Códigos de estado esperados

- `200` → lectura exitosa o actualización exitosa.
- `201` → creación exitosa.
- `204` → borrado exitoso (sin body).
- `400` → datos inválidos.
- `404` → recurso no encontrado.
- `500` → error interno (debe ir por middleware de errores).

## Formato de respuesta

Usar el mismo formato que en `users`:

```json
{
  "message": "Usuario creado",
  "data": { "id": "5", "name": "..." }
}
```

Para listados:

```json
{ "data": [ ... ] }
```

## Ejemplos de uso

### Crear producto

`POST /api/products`

Body:

```json
{
  "name": "Notebook Lenovo Ideapad 3",
  "brand": "Lenovo",
  "category": "notebook",
  "price": 850000,
  "stock": 5
}
```

Respuesta `201`:

```json
{
  "message": "Producto creado",
  "data": {
    "id": "9",
    "name": "Notebook Lenovo Ideapad 3",
    "brand": "Lenovo",
    "category": "notebook",
    "price": 850000,
    "stock": 5
  }
}
```

### Actualizar producto

`PUT /api/products/2`

Body:

```json
{
  "name": "Monitor Samsung 24 FHD",
  "brand": "Samsung",
  "category": "monitor",
  "price": 220000,
  "stock": 12
}
```

### Eliminar producto

`DELETE /api/products/3` → `204 No Content`.

## Datos de prueba (mock)

Usar como estado inicial el archivo `src/data/productData.js` provisto con el ejercicio, que carga un set de productos de prueba al iniciar la app.

## Consideraciones importantes

- Respeta la separación por capas (`routes`, `controllers`, `services`, `data`).
- Usa verbos HTTP y status codes correctos.
- Implementa todas las validaciones mínimas.
- Maneja errores inesperados vía middleware global.
- El código es claro, consistente con el estilo del resto del proyecto.
