import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartsColl = "carts";

const cartsSchema = new mongoose.Schema(
    {
        products: [
            {
                id: String,
                quantity: Number,
            }
        ]
    },
    {
        timestamps: true,
        strict: false,
    }
)

cartsSchema.plugin(paginate);

export const cartsModel = mongoose.model(cartsColl, cartsSchema);