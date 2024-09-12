import fs from "fs";
import { productsModel } from "./models/products.model.js";

export class ProductManager {
    static path;

    static async getProducts() {
        return productsModel.find().limit(10).lean();
    }

    static async getProductsLimited(limit) {
        return productsModel.find().limit(limit).lean();
    }

    static async pidVerify(pid) {
        return productsModel.findById(pid);
    }

    static async getProductsById(pid) {
        return productsModel.findOne({ _id: pid }).lean();
    }

    static async addProduct(newProduct) {
       productsModel.create(newProduct);
    }

    static async deleteProduct(pid) {
        console.log(pid);
        productsModel.deleteOne({ _id: pid });
    }

    static async updateProduct(prodUpdated, pid) {
        if (fs.existsSync(this.path)) {
            const products = JSON.parse(
                await fs.promises.readFile(this.path, { encoding: "utf-8" }),
            );

            const newProducts = products.map((prod) =>
                prod.id === pid ? { ...prod, ...prodUpdated } : prod,
            );

            await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2), {
                encoding: "utf-8",
            });
        } else {
            return [];
        }
    }
}
