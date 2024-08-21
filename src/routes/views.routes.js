import { Router } from "express";

export const viewsRouter = Router();

viewsRouter.get("/",(req,res) => {

    const saludo = "BUEEENAS"

    res.setHeader("Content-Type", "text/html");
    res.status(200).render("home",{
        saludo
    })
});

viewsRouter.get("/realtimeproducts",(req,res) => {
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("realTimeProducts")
})
