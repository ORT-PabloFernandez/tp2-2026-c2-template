import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../data/productData.js";

function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function validateProductData(data) {
    const { name, brand, category, price, stock } = data;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        throw createHttpError(400, "El campo 'name' es obligatorio y no puede estar vacío");
    }
    if (!brand || typeof brand !== "string" || brand.trim().length === 0) {
        throw createHttpError(400, "El campo 'brand' es obligatorio");
    }
    if (!category || typeof category !== "string" || category.trim().length === 0) {
        throw createHttpError(400, "El campo 'category' es obligatorio");
    }
    if (typeof price !== "number" || Number.isNaN(price) || price <= 0) {
        throw createHttpError(400, "El campo 'price' debe ser numérico y mayor a 0");
    }
    if (!Number.isInteger(stock) || stock < 0) {
        throw createHttpError(400, "El campo 'stock' debe ser un número entero mayor o igual a 0");
    }
}

export async function listProducts(filters = {}) {
    return await getAllProducts(filters);
}

export async function findProductById(id) {
    const product = await getProductById(id);
    if (!product) {
        throw createHttpError(404, "Producto no encontrado");
    }
    return product;
}

export async function addProduct(data) {
    validateProductData(data);
    const { name, brand, category, price, stock } = data;
    return await createProduct({ name: name.trim(), brand: brand.trim(), category: category.trim(), price, stock });
}

export async function replaceProduct(id, data) {
    validateProductData(data);
    const { name, brand, category, price, stock } = data;
    const updated = await updateProduct(id, { name: name.trim(), brand: brand.trim(), category: category.trim(), price, stock });
    if (!updated) {
        throw createHttpError(404, "Producto no encontrado");
    }
    return updated;
}

export async function removeProduct(id) {
    const deleted = await deleteProduct(id);
    if (!deleted) {
        throw createHttpError(404, "Producto no encontrado");
    }
}
