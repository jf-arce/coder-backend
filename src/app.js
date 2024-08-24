import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { ProductManager } from "./dao/ProductManager.js";
import { CartManager } from "./dao/CartManager.js";
import { engine } from "express-handlebars";
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";

// Server
const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
export const io = new Server(httpServer);

// Paths
ProductManager.path = "./src/db/products.json";
CartManager.path = "./src/db/carts.json"

// Middlewares          
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handlebars config
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Socket.io
io.on("connection", socket => {
    console.log("Nuevo cliente conectado!");
})
