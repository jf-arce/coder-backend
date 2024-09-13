import { productsModel } from "./models/products.model.js";

export class ProductManager {
    static async getProducts(limit = 10, page = 1, query, sort) {
        const response = await productsModel.paginate(
            query
                ? {
                      $expr: {
                          $eq: [{ $toLower: "$category" }, query.toLowerCase()], //Case insensitive
                      },
                  }
                : {},
            {
                lean: true, //Return plain JS objects instead of Mongoose Documents
                limit,
                page,
                sort: sort ? (sort === "asc" ? { price: 1 } : { price: -1 }) : null,
            },
        );

        return {
            status: response ? "success" : "error",
            payload: response.docs,
            totalPages: response.totalPages,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: response.page,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            prevLink: response.hasPrevPage
                ? `/api/products?limit=${limit}&page=${response.prevPage}`
                : null,
            nextLink: response.hasNextPage
                ? `/api/products?limit=${limit}&page=${response.nextPage}`
                : null,
        };
    }

    static async pidVerify(pid) {
        return await productsModel.findById(pid);
    }

    static async getProductsById(pid) {
        return await productsModel.findOne({ _id: pid }).lean();
    }

    static async addProduct(newProduct) {
        await productsModel.create(newProduct);
    }

    static async deleteProduct(pid) {
        await productsModel.findByIdAndDelete(pid, { new: true });
    }

    static async updateProduct(prodUpdated, pid) {
        await productsModel.findByIdAndUpdate(pid, prodUpdated, { new: true });
    }
}
