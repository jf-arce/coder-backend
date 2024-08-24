import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";

export const viewsRouter = Router();

viewsRouter.get("/",async (req,res) => {
    try {
        const products = await ProductManager.getProducts();

        res.setHeader("Content-Type", "text/html");
        res.status(200).render("home", {
            title: "Home",
            products
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

viewsRouter.get("/realtimeproducts",async (req,res) => {
    try{
        const products = await ProductManager.getProducts();
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("realTimeProducts",{
            title: "Real Time Products",
            products
        })
    }catch(error){
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
})
