import { isValidObjectId } from "mongoose";
import { ProductManager } from "../dao/ProductManager.js";

export const pidValidate = async (req, res, next) => {
    const { pid } = req.params;
    
    if (!isValidObjectId(pid)){
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "El id no es valido" });
    }

    try {
        await ProductManager.pidVerify(pid);
        next();
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: `El producto con id ${pid} no existe`,
            detalle: `${error.message}`,
        });
    }
};
