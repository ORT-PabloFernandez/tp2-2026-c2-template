import { ObjectId } from "mongodb";
import { getDb } from "./connection.js";

function getCollection() {
    return getDb().collection("products");
}

// Convierte el documento de Mongo ({ _id, ... }) al formato que usa la app ({ id, ... })
function mapProduct(doc) {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
}

// Devuelve null si el id no es un ObjectId válido (24 caracteres hex)
function toObjectId(id) {
    return ObjectId.isValid(id) && String(id).length === 24 ? new ObjectId(id) : null;
}

export async function getAllProducts({ category, brand } = {}) {
    const filter = {};
    if (category) filter.category = String(category);
    if (brand) filter.brand = String(brand);
    // collation strength 2: compara sin distinguir mayúsculas/minúsculas
    const products = await getCollection()
        .find(filter, { collation: { locale: "es", strength: 2 } })
        .toArray();
    return products.map(mapProduct);
}

export async function getProductById(id) {
    const _id = toObjectId(id);
    if (!_id) return null;
    const product = await getCollection().findOne({ _id });
    return mapProduct(product);
}

export async function createProduct(productData) {
    const doc = { ...productData };
    const { insertedId } = await getCollection().insertOne(doc);
    return { id: insertedId.toString(), ...productData };
}

export async function updateProduct(id, productData) {
    const _id = toObjectId(id);
    if (!_id) return null;
    const updated = await getCollection().findOneAndReplace({ _id }, productData, { returnDocument: "after" });
    return mapProduct(updated);
}

export async function deleteProduct(id) {
    const _id = toObjectId(id);
    if (!_id) return false;
    const { deletedCount } = await getCollection().deleteOne({ _id });
    return deletedCount === 1;
}
