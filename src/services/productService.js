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

export function listProducts(filters = {}) {
    let products = getAllProducts();
    const { category, brand } = filters;

    if (category) {
        products = products.filter((product) => product.category.toLowerCase() === String(category).toLowerCase());
    }
    if (brand) {
        products = products.filter((product) => product.brand.toLowerCase() === String(brand).toLowerCase());
    }

    return products;
}

export function findProductById(id) {
    const product = getProductById(id);
    if (!product) {
        throw createHttpError(404, "Producto no encontrado");
    }
    return product;
}

export function addProduct(data) {
    validateProductData(data);
    const { name, brand, category, price, stock } = data;
    return createProduct({ name: name.trim(), brand: brand.trim(), category: category.trim(), price, stock });
}

export function replaceProduct(id, data) {
    validateProductData(data);
    const { name, brand, category, price, stock } = data;
    const updated = updateProduct(id, { name: name.trim(), brand: brand.trim(), category: category.trim(), price, stock });
    if (!updated) {
        throw createHttpError(404, "Producto no encontrado");
    }
    return updated;
}

export function removeProduct(id) {
    const deleted = deleteProduct(id);
    if (!deleted) {
        throw createHttpError(404, "Producto no encontrado");
    }
}
