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
            products: { $elemMatch: { _id: pid } },
        });

        if (productExist) {
            // Si existe el producto, incremento la cantidad
            await cartsModel.updateOne(
                { _id: cid, 'products._id': pid },
                { $inc: { 'products.$.quantity': 1 } },
                { new: true }
            );
        } else {
            // Si no existe el producto, lo agrego al carrito
            await cartsModel.findByIdAndUpdate(
                cid,
                { $push: { products: { _id: pid, quantity: 1 } } },
                { new: true },
            );
        }
    }
}
