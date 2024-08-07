import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";
import crypto from "crypto";
import { uploader } from "../utils/uploader.js";

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

productsRouter.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    if (!pid) return res.status(400).json({ error: "Se tiene que pasar el id" });

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
    const { price, stock, status, ...body } = req.body;

    if (
        !price ||
        !stock ||
        !body.title ||
        !body.description ||
        !body.code ||
        !body.category ||
        !body.brand ||
        !body.model
    ) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (isNaN(priceNumber) || isNaN(stockNumber))
        return res.status(400).json({ error: "El precio y el stock deben ser un numero" });

    const newProduct = {
        id: crypto.randomUUID(),
        ...body,
        price: priceNumber,
        status: status ? status : true,
        stock: stockNumber,
        thumbnails: req.files.map((file) => file.path),
    };

    try {
        await ProductManager.addProduct(newProduct);
        res.sendStatus("Content-Type", "application/json");
        res.status(201).json({ message: "Producto creado correctamente", product: newProduct });
    } catch (e) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    if (!pid) return res.status(400).json({ error: "Se debe pasar un id por parametro" });

    try {
        await ProductManager.deleteProduct(pid);
        res.sendStatus("Content-Type", "application/json");
        res.status(204).json({ mensaje: "El producto se elimino correctamente." });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

productsRouter.put("/:pid", uploader.array("thumbnails", 3), async (req, res) => {
    const { pid } = req.params;

    if (!pid) return res.status(400).json({ error: "Se debe pasar un id como parametro" });

    if (!req.files) {
        return res.status(400).json({ error: "No se pudieron guardar las imagenes" });
    }
    const { price, stock, ...body } = req.body;

    if (
        !price ||
        !stock ||
        !body.title ||
        !body.description ||
        !body.code ||
        !body.category ||
        !body.brand ||
        !body.model
    ) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (isNaN(priceNumber) || isNaN(stockNumber))
        return res.status(400).json({ error: "El precio y el stock deben ser un numero" });

    const productUpdated = {
        ...body,
        price: priceNumber,
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
    } catch (e) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});
