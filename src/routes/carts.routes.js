import { Router } from "express";
import { CartManager } from "../dao/CartManager.js";
import { isValidObjectId } from "mongoose";
import { ProductManager } from "../dao/ProductManager.js";

export const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
    try {
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

    if (!isValidObjectId(cid) ) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ message: "Id invalido" });
    }

    try {
        const products = await CartManager.getCartProducts(cid);
        if (!products) return res.status(404).json({ error: "El carrito no existe" });
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

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ message: "Cid o Pid invalido" });
    }
    try {
        const prodExist = await ProductManager.getProductsById(pid);
        if (!prodExist) {
            return res.status(404).json({error: `El producto con id ${pid} no existe`});
        }

        const cardExist = await CartManager.getCartProducts(cid);
        if (!cardExist) return res.status(404).json({error: `El carrito con id ${cid} no existe`});

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

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    if (!cid || !pid)
        return res
            .status(400)
            .json({ error: "Tienen que pasarse todos los parametros obligatorios" });

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ message: "Cid o Pid invalido" });
    }
    try {
        const cardExist = await CartManager.getCartProducts(cid);
        if (!cardExist) return res.status(404).json({error: `El carrito con id ${cid} no existe`});

        await CartManager.deleteProductFromCart(cid, pid);
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params;

    if (!cid )
        return res
            .status(400)
            .json({ error: "Tienen que pasarse todos los parametros obligatorios" });

    if (!isValidObjectId(cid) ) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ message: "Id invalido" });
    }
    try {
        const cardExist = await CartManager.getCartProducts(cid);
        if (!cardExist) return res.status(404).json({error: `El carrito con id ${cid} no existe`});

        await CartManager.deleteAllProducts(cid);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ message: "Productos eliminados correctamente" });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});


cartsRouter.put("/:cid", async(req, res)=> {
    const { cid } = req.params;
    const products = req.body;

    if (!cid )
        return res
            .status(400)
            .json({ error: "Tienen que pasarse todos los parametros obligatorios" });

    if (!isValidObjectId(cid) ) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ message: "Id invalido" });
    }

    if (!products) return res.status(400).json({error: "No se paso ningun producto"});

    try {
        for (const prod of products) {
            if (!isValidObjectId(prod.product)) {
                return res.status(400).json({error: `El id del producto ${prod.product} no es valido`});
            }
            const prodExist = await ProductManager.getProductsById(prod.product);
            if (!prodExist) {
                return res.status(404).json({error: `El producto con id ${prod.product} no existe`});
            }
        }

        const cardExist = await CartManager.getCartProducts(cid);
        if (!cardExist) return res.status(404).json({error: `El carrito con id ${cid} no existe`});

        await CartManager.updateAllCart(cid, products);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ message: "Carrito actualizado con los productos correctamente" });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
})

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!cid || !pid )
        return res
            .status(400)
            .json({ error: "Tienen que pasarse todos los parametros obligatorios" });

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ message: "Cid o Pid invalido" });
    }
    
    if (!quantity) return res.status(400).json({error: "No se paso ninguna cantidad"});

    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber)) return res.status(400).json({error: "La cantidad debe ser un numero"});

    try {
        const prodExist = await ProductManager.getProductsById(pid);
        if (!prodExist) {
            return res.status(404).json({error: `El producto con id ${pid} no existe`});
        }
        const cardExist = await CartManager.getCartProducts(cid);
        if (!cardExist) return res.status(404).json({error: `El carrito con id ${cid} no existe`});

        await CartManager.updateProductQuantity(cid, pid, quantityNumber);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ message: "Cantidad actualizada correctamente" });
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

