import mongoose from "mongoose";
import { config } from "./config/config.js";

export const dbConnection = async()=>{
    try{
        await mongoose.connect(
            config.MONGO_URL,
            {dbName: config.DB_NAME}
        )
        console.log("DB conectada con exito");
    }catch(error){
        console.log("Error al conectar con la db: ", error.message);
    }
}