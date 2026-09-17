import express from "express";
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

const productRoutes = express.Router();

// GET /api/products
// GET /api/products?category=notebook
// GET /api/products?brand=Logitech
productRoutes.get("/", getProducts);

// GET /api/products/:id
productRoutes.get("/:id", getProduct);

// POST /api/products
productRoutes.post("/", createProduct);

// PUT /api/products/:id
productRoutes.put("/:id", updateProduct);

// DELETE /api/products/:id
productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
