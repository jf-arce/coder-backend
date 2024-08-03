import fs from "fs"

export class ProductManager{
    static path
    
    static async getProducts(){
        if (fs.existsSync(this.path)){ 
            const products = await fs.promises.readFile(this.path, {encoding:"utf-8"})
            
            return JSON.parse(products)
        }else{
            return [];
        }
    }
}