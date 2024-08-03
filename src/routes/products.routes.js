import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";

export const productsRouter = Router();

productsRouter.get("/",async (req,res)=>{
    const { limit } = req.query
   
    const products = await ProductManager.getProducts()

    if (limit){
        const limitNumber = Number(limit);
        if (isNaN(limitNumber)){
            return res.status(400).json({error: "El argumento limit tiene que ser un numero"})
        }else{
            const productsLimit = products.slice(0,limitNumber)
            return res.status(200).json(productsLimit)
        }            
    }

    res.setHeader("Content-Type", "application/json")
    res.status(200).json(products)
})




