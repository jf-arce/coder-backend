import mongoose from "mongoose";

const cartsColl = "carts";

const cartsSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products",
                    },
                    quantity: Number,
                },
            ],
        },
    },
    {
        timestamps: true,
        strict: false,
    },
);

cartsSchema.pre("findOne", function(){
    this.populate("products.product").lean(); // Para que siempre devuelva los productos con sus datos
});

export const cartsModel = mongoose.model(cartsColl, cartsSchema);
