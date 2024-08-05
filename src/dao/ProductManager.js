import fs from "fs"

export class ProductManager{
    static path
    
    static async getProducts(){
        if (fs.existsSync(this.path)){ 
            const products = await fs.promises.readFile(this.path, {encoding:"utf-8"}) 
            return JSON.parse(products);
        }else{
            return [];
        }
    }

    static async getProductsById(pid){
        if (fs.existsSync(this.path)){ 
            const products = await fs.promises.readFile(this.path, {encoding:"utf-8"}); 
            const prod = JSON.parse(products).find(p => p.id === pid);

            return prod;
        }else{
            return [];
        }
    }

    static async addProduct(newProduct){
        
        if(fs.existsSync(this.path)){
            const products = await fs.promises.readFile(this.path, {encoding:"utf-8"});
            
            const productsArray = JSON.parse(products)
            
            productsArray.push(newProduct);
            
            await fs.promises.writeFile(this.path, JSON.stringify(productsArray,null,2), {encoding: "utf-8"});
            
        }        
    }
}