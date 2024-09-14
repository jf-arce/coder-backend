import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { ProductManager } from "./dao/ProductManager.js";
import { CartManager } from "./dao/CartManager.js";
import { engine } from "express-handlebars";
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";
import { dbConnection } from "./dbConnection.js";
import { config } from "./config/config.js";

// Server
const app = express();
const PORT = config.PORT;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}/products`);
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
    socket.on("message", message => {
        console.log(message);
    });
})

//MongoDB connetion
dbConnection();
