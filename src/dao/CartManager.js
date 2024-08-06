import fs from "fs";
import crypto from "crypto"; 

export class CartManager {
    static path; 

    static async createCart() {
        if (!this.path) {
            throw new Error("Path is not defined");
        }

        if (fs.existsSync(this.path)) {
            const cart = {
                id: crypto.randomUUID(),
                cart: [] 
            };

            const cartBD = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));

            cartBD.push(cart);

            await fs.promises.writeFile(this.path, JSON.stringify(cartBD, null, 2), { encoding: "utf-8" });
        } else {

            throw new Error(`File at path ${this.path} does not exist`);
        }
    }
}
