import { Router } from "express";
import { CartManager } from "../dao/CartManager.js";

export const cartsRouter = Router()

cartsRouter.post('/',async (req,res)=>{
    try{
        await CartManager.createCart();
        res.status(201).json({message: "Carrito creado con exito"}, );
    }catch(error){
        console.log("Error en crear en el carrito")
    }

})