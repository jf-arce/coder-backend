import fs from "fs";

export class ProductManager {
    static path;

    static async getProducts() {
        if (fs.existsSync(this.path)) {
            const products = await fs.promises.readFile(this.path, { encoding: "utf-8" });
            return JSON.parse(products);
        } else {
            return [];
        }
    }

    static async pidVerify(pid){
        if(fs.existsSync(this.path)){
            const products = JSON.parse(
                await fs.promises.readFile(this.path, { encoding: "utf-8" }),
            );
            const product = products.find((product) => product.id === pid);
            if (!product) {
                throw new Error(`El producto ${pid} no existe`);
            }
        }else{
            throw new Error("La ruta de la base de datos no existe");
        }
    }

    static async getProductsById(pid) {
        if (fs.existsSync(this.path)) {
            const products = await fs.promises.readFile(this.path, { encoding: "utf-8" });
            const prod = JSON.parse(products).find((p) => p.id === pid);
            return prod;
        } else {
            return [];
        }
    }

    static async addProduct(newProduct) {
        if (fs.existsSync(this.path)) {
            const products = await fs.promises.readFile(this.path, { encoding: "utf-8" });
            const productsArray = JSON.parse(products); 
            productsArray.push(newProduct);

            await fs.promises.writeFile(this.path, JSON.stringify(productsArray, null, 2), {
                encoding: "utf-8",
            });
        } else {
            return [];
        }
    }

    static async deleteProduct(pid) {
        if (fs.existsSync(this.path)) {
            const products = JSON.parse(
                await fs.promises.readFile(this.path, { encoding: "utf-8" }),
            );

            const newProducts = products.filter((product) => product.id !== pid);

            await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2), {
                encoding: "utf-8",
            });
        } else {
            return [];
        }
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
