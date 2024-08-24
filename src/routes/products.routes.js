import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";
import crypto from "crypto";
import { uploader } from "../utils/uploader.js";
import { pidValidate } from "../middlewares/pidValidate.js";
import { io } from "../app.js";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        const products = await ProductManager.getProducts();

        if (!limit) return res.status(200).json(products);

        const limitNumber = Number(limit);
        if (isNaN(limitNumber)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "El argumento limit tiene que ser un numero" });
        } else {
            const productsLimit = products.slice(0, limitNumber);
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json(productsLimit);
        }
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

productsRouter.get("/:pid", pidValidate, async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await ProductManager.getProductsById(pid);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(product);
    } catch (e) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

productsRouter.post("/", uploader.array("thumbnails", 3), async (req, res) => {
    if (!req.files) {
        return res.status(400).json({ error: "No se pudieron guardar las imagenes" });
    }
    const { price, stock, title, description, code, category } = req.body;

    if (
        !price ||
        !stock ||
        !title ||
        !description ||
        !code ||
        !category
    ) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (isNaN(priceNumber) || isNaN(stockNumber)){
        return res.status(400).json({ error: "El precio y el stock deben ser un numero" });
    }

    if (stockNumber < 0 || priceNumber <= 0) {
        return res.status(400).json({ error: "El precio y el stock deben ser mayor a 0" });
    }

    const newProduct = {
        id: crypto.randomUUID(),
        title,
        description,
        code,
        category,
        price: priceNumber,
        status: true,
        stock: stockNumber,
        thumbnails: req.files.map((file) => file.path),
    };

    try {
        await ProductManager.addProduct(newProduct);
        io.emit("addProduct", newProduct);
        res.setHeader("Content-Type", "application/json");
        res.status(201).json({ message: "Producto creado correctamente", product: newProduct });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

productsRouter.delete("/:pid", pidValidate, async (req, res) => {
    const { pid } = req.params;
    
    try {
        await ProductManager.deleteProduct(pid);
        io.emit("deleteProduct", pid);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ mensaje: "El producto se elimino correctamente.", id: pid });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

productsRouter.put("/:pid", pidValidate, uploader.array("thumbnails", 3), async (req, res) => {
    const { pid } = req.params;
    
    if (!req.files) {
        return res.status(400).json({ error: "No se pudieron guardar las imagenes" });
    }
    const { price, stock, title, description, code, category } = req.body;

    if (
        !price ||
        !stock ||
        !title ||
        !description ||
        !code ||
        !category
    ) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (isNaN(priceNumber) || isNaN(stockNumber)){
        return res.status(400).json({ error: "El precio y el stock deben ser un numero" });
    }

    if (stockNumber < 0 || priceNumber <= 0) {
        return res.status(400).json({ error: "El precio y el stock deben ser mayor a 0" });
    }

    const productUpdated = {
        id: crypto.randomUUID(),
        title,
        description,
        code,
        category,
        price: priceNumber,
        status: true,
        stock: stockNumber,
        thumbnails: req.files.map((file) => file.path),
    };

    try {
        await ProductManager.updateProduct(productUpdated, pid);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({
            mensaje: "Producto modificado correctamente",
            product: productUpdated,
        });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});
