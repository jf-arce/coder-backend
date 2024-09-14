import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";
import { CartManager } from "../dao/CartManager.js";

export const viewsRouter = Router();

viewsRouter.get("/products", async (req, res) => {
    try {
        const products = await ProductManager.getProducts();
        const carts = await CartManager.getCartProducts("66e4801c7f809369afe2de10");

        res.setHeader("Content-Type", "text/html");
        res.status(200).render("home", {
            title: "Home",
            products: products.payload,
            page: products.page,
            totalPages: products.totalPages,
            numCarts: carts.products.length,
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

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await ProductManager.getProducts();
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("realTimeProducts", {
            title: "Real Time Products",
            products: products.payload,
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


viewsRouter.get("/cart", async (req, res) => {
    try {
        const cartProducts = await CartManager.getCartProducts("66e4801c7f809369afe2de10");
        
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("cart", {
            title: "Cart",
            products: cartProducts.products,
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
