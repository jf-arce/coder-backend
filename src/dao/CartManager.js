import { cartsModel } from "./models/carts.model.js";

export class CartManager {
    static async createCart() {
        const cart = {
            products: [],
        };

        return await cartsModel.create(cart);
    }

    static async getCartProducts(cid) {
        return await cartsModel.findOne({ _id: cid });
    }

    static async addProductToCart(cid, pid) {
        const productExist = await cartsModel.findOne({
            _id: cid,
            products: { $elemMatch: { product: pid } },
        });

        if (productExist) {
            // Si existe el producto, incremento la cantidad
            await cartsModel.updateOne(
                { _id: cid, "products.product": pid },
                { $inc: { "products.$.quantity": 1 } },
            );
        } else {
            // Si no existe el producto, lo agrego al carrito
            await cartsModel.updateOne(
                { _id: cid },
                { $push: { products: { product: pid, quantity: 1 } } },
            );
        }
    }

    static async deleteProductFromCart(cid, pid) {
        const productExist = await cartsModel.findOne({
            _id: cid,
            products: { $elemMatch: { product: pid } },
        });

        if (!productExist) throw new Error(`El producto con id ${pid} no existe en el carrito`);

        await cartsModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } } });
    }

    static async deleteAllProducts(cid) {
        await cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
    }

    static async updateAllCart(cid, prods) {
        await cartsModel.updateOne({ _id: cid }, { $set: { products: prods } });
    }

    static async updateProductQuantity(cid, pid, quantity) {
        await cartsModel.updateOne(
            { _id: cid, "products.product": pid },
            { $set: { "products.$.quantity": quantity } },
        );
    }
}
