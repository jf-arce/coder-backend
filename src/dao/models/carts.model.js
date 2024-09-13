import mongoose from "mongoose";

const cartsColl = "carts";

const cartsSchema = new mongoose.Schema(
    {
        products: [
            {
                id: String,
                quantity: Number,
            },
        ],
    },
    {
        timestamps: true,
        strict: false,
    },
);

export const cartsModel = mongoose.model(cartsColl, cartsSchema);
