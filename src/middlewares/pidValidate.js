import { ProductManager } from "../dao/ProductManager.js";

export const pidValidate = async (req,res,next) => {
    const {pid} = req.params;
    if (!pid) return res.status(400).json({error: "Se tiene que pasar el id"});
    try{
        await ProductManager.pidVerify(pid);
        next();
    }catch(error){
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
}