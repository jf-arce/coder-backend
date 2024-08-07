import fs from "fs";
import crypto from "crypto";

export class CartManager {
    static path;

    static async createCart() {
        if (fs.existsSync(this.path)) {
            const cart = {
                id: crypto.randomUUID(),
                products: [],
            };
            const cartBD = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
            cartBD.push(cart);

            await fs.promises.writeFile(this.path, JSON.stringify(cartBD, null, 2), {
                encoding: "utf-8",
            });

            return cart;
        } else {
            throw new Error(`El archivo en el path ${this.path} no existe`);
        }
    }

    static async getCartProducts(cid) {
        if (fs.existsSync(this.path)) {
            const carts = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
            const cartFound = carts.find((cart) => cart.id === cid);
            if (!cartFound) throw new Error(`No se encontro el carrito con el id ${cid}`);
            return cartFound.products;
        } else {
            throw new Error(`El archivo en el path ${this.path} no existe`);
        }
    }

    static async addProductToCart(cid, pid) {
        if (fs.existsSync(this.path)) {
            const carts = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
            const cartFound = carts.find((cart) => cart.id === cid);
            if (!cartFound) {
                throw new Error("Cart not found");
            }
            const productExist = cartFound.products.some((prod) => prod.id === pid);
            let newCart;
            if (productExist) {
                newCart = {
                    ...cartFound,
                    products: cartFound.products.map((prod) =>
                        prod.id === pid ? { ...prod, quantity: prod.quantity + 1 } : prod,
                    ),
                };
            } else {
                newCart = {
                    ...cartFound,
                    products: [...cartFound.products, { id: pid, quantity: 1 }],
                };
            }

            const newCartsArray = carts.map((cart) => (cart.id === newCart.id ? newCart : cart));
            await fs.promises.writeFile(this.path, JSON.stringify(newCartsArray, null, 2), {
                encoding: "utf-8",
            });
        } else {
            throw new Error(`El archivo en el path ${this.path} no existe`);
        }
    }
}
