import express from 'express';
import { productsRouter } from './routes/products.routes.js';
import { cartsRouter } from './routes/carts.routes.js';
import { ProductManager } from './dao/ProductManager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

ProductManager.path = "./src/db/products.json";

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter)


const PORT = 8080;

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})

