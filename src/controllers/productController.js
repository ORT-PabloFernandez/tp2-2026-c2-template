import {
    listProducts,
    findProductById,
    addProduct,
    replaceProduct,
    removeProduct,
} from "../services/productService.js";

function handleServiceError(error, res, next) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
}

export async function getProducts(req, res, next) {
    try {
        const { category, brand } = req.query;
        const products = await listProducts({ category, brand });
        res.status(200).json({ data: products });
    } catch (error) {
        handleServiceError(error, res, next);
    }
}

export async function getProduct(req, res, next) {
    try {
        const { id } = req.params;
        const product = await findProductById(id);
        res.status(200).json({ data: product });
    } catch (error) {
        handleServiceError(error, res, next);
    }
}

export async function createProduct(req, res, next) {
    try {
        const product = await addProduct(req.body);
        res.status(201).json({ message: "Producto creado", data: product });
    } catch (error) {
        handleServiceError(error, res, next);
    }
}

export async function updateProduct(req, res, next) {
    try {
        const { id } = req.params;
        const product = await replaceProduct(id, req.body);
        res.status(200).json({ message: "Producto actualizado", data: product });
    } catch (error) {
        handleServiceError(error, res, next);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params;
        await removeProduct(id);
        res.status(204).send();
    } catch (error) {
        handleServiceError(error, res, next);
    }
}
