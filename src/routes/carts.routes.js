import { Router } from "express";
import { CartManager } from "../dao/CartManager.js";

export const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
    try {
        console.log("hola");
        const cart = await CartManager.createCart();
        res.setHeader("Content-Type", "application/json");
        res.status(201).json({ message: "Carrito creado con exito", cart });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    if (!cid) return res.status(400).json({ error: "No se paso el id del carrito" });

    try {
        const products = await CartManager.getCartProducts(cid);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    if (!cid || !pid)
        return res
            .status(400)
            .json({ error: "Tienen que pasarse todos los parametros obligatorios" });

    try {
        await CartManager.addProductToCart(cid, pid);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ message: "Producto agregado correctamente" });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});
