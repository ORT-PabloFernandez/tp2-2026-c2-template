# Ejercicio: Migrar la capa de datos de Products a MongoDB

## Objetivo

Reemplazar el acceso a datos en memoria de `productData.js` por una capa que se conecte a una base de datos real **MongoDB Atlas** usando el driver oficial `mongodb`.

La lógica de negocio (`productService.js`), los controladores y las rutas **no deben modificarse**. Solo se toca la capa `data`.

## Alcance

- Crear `src/data/connection.js` con la lógica de conexión provista.
- Reescribir `src/data/productData.js` para que todas sus funciones usen la colección `products` de MongoDB.
- Inicializar la conexión al arrancar el servidor en `server.js`.
- Agregar `MONGODB_URI` al archivo `.env`.

## Archivos a modificar / crear

- `src/data/connection.js` → **crear** con el código de conexión provisto.
- `src/data/productData.js` → **reescribir** usando la DB en lugar del array en memoria.
- `server.js` → **modificar** para conectar a la DB antes de levantar el servidor.
- `.env` → **agregar** la variable `MONGODB_URI`.

> `productService.js`, `productController.js` y `productRoutes.js` **no deben tocarse**.

## Paso 1 — Crear `src/data/connection.js`

Crear el archivo con exactamente el siguiente contenido:

```js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("❌ La variable de entorno MONGODB_URI no esta definitda");
}

let client;
let db;

export async function connectToDatabase() {
    if (!client) {
        try {
            client = new MongoClient(uri);
            await client.connect();
            db = client.db("sample_tp2");
            console.log("✅ Conexión a MongoDB establecida");
        } catch (error) {
            console.error("❌ Error conectando a MongoDB", error.message);
            throw error;
        }
    }
    return db;
}

export function getDb() {
    if (!db) {
        throw new Error("Debes conectar a la base de datos primero usando ConnectToDatabase()");
    }
    return db;
}
```

## Paso 2 — Agregar la dependencia y la variable de entorno

Instalar el driver oficial de MongoDB:

```bash
npm install mongodb
```

Agregar en `.env`:

```
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

> Reemplazar con la cadena de conexión real de MongoDB Atlas. Nunca commitear el `.env`.

## Paso 3 — Inicializar la conexión en `server.js`

Modificar `server.js` para que la conexión a la base de datos ocurra **antes** de que el servidor empiece a escuchar:

```js
import app from './src/app.js';
import { connectToDatabase } from './src/data/connection.js';

const PORT = process.env.PORT || 3000;

connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("No se pudo iniciar el servidor:", error.message);
        process.exit(1);
    });
```

## Paso 4 — Reescribir `src/data/productData.js`

Eliminar el array `mockProducts` y reemplazar cada función para que use `getDb()` y opere sobre la colección `products`.

### Consideraciones importantes sobre `_id` y `id`

MongoDB usa `_id` (ObjectId) como identificador. Para mantener compatibilidad con el resto de la app (que usa `id` como string), deben:

1. Al insertar, dejar que MongoDB genere el `_id` automáticamente.
2. Al leer, mapear `_id.toString()` → `id` y omitir `_id` del resultado.

### Firma de funciones que deben exportar (sin cambios en la firma)

```js
export async function findAllProducts({ category, brand } = {}) { ... }
export async function findProductById(id) { ... }
export async function insertProduct(product) { ... }
export async function replaceProduct(id, product) { ... }
export async function removeProduct(id) { ... }
```

> **Todas las funciones pasan a ser `async`** porque las operaciones de MongoDB son asíncronas.

### Ayuda — Operaciones de colección útiles

| Operación | Método del driver |
|-----------|-------------------|
| Buscar todos | `collection.find(filtro).toArray()` |
| Buscar uno por `_id` | `collection.findOne({ _id: new ObjectId(id) })` |
| Insertar | `collection.insertOne(doc)` → devuelve `{ insertedId }` |
| Reemplazar | `collection.findOneAndReplace({ _id: new ObjectId(id) }, doc, { returnDocument: "after" })` |
| Eliminar | `collection.deleteOne({ _id: new ObjectId(id) })` → devuelve `{ deletedCount }` |

Para usar `ObjectId`:

```js
import { ObjectId } from "mongodb";
```

### Manejo de `id` inválido

Si el `id` recibido no tiene el formato válido de un ObjectId (24 caracteres hex), `new ObjectId(id)` lanza una excepción. Capturarla y devolver `null` / `false` según corresponda, para que el servicio responda `404`.

### Ejemplo — `findProductById`

```js
export async function findProductById(id) {
    try {
        const db = getDb();
        const collection = db.collection("products");
        const product = await collection.findOne({ _id: new ObjectId(id) });
        if (!product) return null;
        const { _id, ...rest } = product;
        return { id: _id.toString(), ...rest };
    } catch {
        return null;
    }
}
```

## Paso 5 — Adaptar `productService.js` (solo si es necesario)

`productService.js` llama a las funciones de `productData.js` de forma sincrónica. Como ahora son `async`, el servicio debe hacer `await` en cada llamada y sus funciones también deben ser `async`.

```js
export async function getProducts(filters) {
    return await findAllProducts(filters);
}

export async function getProductById(id) {
    const product = await findProductById(id);
    if (!product) {
        const err = new Error("Producto no encontrado");
        err.status = 404;
        throw err;
    }
    return product;
}
// ... ídem para createProduct, updateProduct, deleteProduct
```

> Los controladores ya usan `async/await` y `next(error)`, por lo que **no necesitan cambios**.

## Validaciones mínimas

Las mismas que en el ejercicio anterior se mantienen en `productService.js`:

- Campos obligatorios presentes.
- `price` numérico y > 0.
- `stock` entero y ≥ 0.
- `name` no vacío ni solo espacios.

## Códigos de estado esperados

Igual que antes — no cambia nada en controladores ni rutas:

- `200` → lectura / actualización exitosa.
- `201` → creación exitosa.
- `204` → borrado exitoso (sin body).
- `400` → datos inválidos.
- `404` → recurso no encontrado.
- `500` → error interno (middleware global).

## Datos de prueba en la base de datos

Una vez conectado, insertar manualmente desde MongoDB Atlas (o con un script) algunos productos con la misma estructura que el mock original para verificar que los endpoints funcionan correctamente.

Estructura esperada de cada documento en la colección `products`:

```json
{
  "name": "Notebook Lenovo Ideapad 3",
  "brand": "Lenovo",
  "category": "notebook",
  "price": 850000,
  "stock": 5
}
```

> El campo `_id` es generado automáticamente por MongoDB. **No incluirlo al insertar.**