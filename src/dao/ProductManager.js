import fs from "fs";
import { productsModel } from "./models/products.model.js";

export class ProductManager {
    static async getProducts(limit=10, page=1, query={}, sort={}) {
        return productsModel.paginate(query,{lean:true, limit, page, sort});
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
