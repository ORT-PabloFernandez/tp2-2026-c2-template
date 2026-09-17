// Datos en memoria (mock). Se reinician cada vez que se reinicia el servidor.
let products = [
    { id: "1", name: "Notebook Lenovo Ideapad 3", brand: "Lenovo", category: "notebook", price: 850000, stock: 5 },
    { id: "2", name: "Monitor Samsung 24 FHD", brand: "Samsung", category: "monitor", price: 220000, stock: 12 },
    { id: "3", name: "Teclado Mecánico Redragon K552", brand: "Redragon", category: "teclado", price: 45000, stock: 20 },
    { id: "4", name: "Mouse Logitech G203", brand: "Logitech", category: "mouse", price: 30000, stock: 25 },
    { id: "5", name: "Placa de Video RTX 4060", brand: "Nvidia", category: "gpu", price: 650000, stock: 3 },
    { id: "6", name: "Memoria RAM Kingston Fury 16GB", brand: "Kingston", category: "ram", price: 60000, stock: 15 },
    { id: "7", name: "SSD Kingston NV2 1TB", brand: "Kingston", category: "almacenamiento", price: 90000, stock: 10 },
    { id: "8", name: "Notebook Dell Inspiron 15", brand: "Dell", category: "notebook", price: 980000, stock: 4 },
];

let nextId = products.length + 1;

export function getAllProducts() {
    return products;
}

export function getProductById(id) {
    return products.find((product) => product.id === id);
}

export function createProduct(productData) {
    const newProduct = { id: String(nextId++), ...productData };
    products.push(newProduct);
    return newProduct;
}

export function updateProduct(id, productData) {
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
        return null;
    }
    products[index] = { id, ...productData };
    return products[index];
}

export function deleteProduct(id) {
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
        return false;
    }
    products.splice(index, 1);
    return true;
}
