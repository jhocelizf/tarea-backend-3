import utils from "./utils.js";
import crypto from "crypto";

export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }
    static correlativoId = 0;
    async addProduct(title, description, price, thumbnail, code, stock) {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos son obligatorios.");
        }
        try {
            let data = await utils.readFile(this.path);
            this.products = data?.length > 0 ? data : [];
            // si data no existiera fuera null o data tiene la longitud mayor que 0 es data
        } catch (error) {
            console.error(error);
        }

        let existingProduct = this.products.some((dato) => dato.code == code);

        if (existingProduct) {
            throw new Error("Por favor verifique, el codigo ya existe!!");
        } else {
            const newProduct = {
                id: crypto.randomUUID(),
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };
            this.products.push(newProduct);
            try {
                await utils.writeFile(this.path, this.products);
            } catch (error) {
                console.log(error);
            }
        }

    }
    async getProducts() {
        try {
            let data = await utils.readFile(this.path);
            this.products = data;
            return data?.length > 0 ? this.products : "No hay registros";
        } catch (error) {
            console.log(error);
        }
    }
    async getProductById(id) {
        try {
            let data = await utils.readFile(this.path);
            this.products = data?.length > 0 ? data : [];
            let product = this.products.find((dato) => dato.id === id);

            if (product !== undefined) {
                return product;
            } else {
                return "no existe el producto solicitado";
            }
        } catch (error) {
            console.log(error);
        }
    }
    async updateProductById(id, data) {
        try {
            let products = await utils.readFile(this.path);
            this.products = products?.length > 0 ? products : [];

            let productIndex = this.products.findIndex((dato) => dato.id === id);
            if (productIndex !== -1) {
                this.products[productIndex] = {
                    ...this.products[productIndex],
                    ...data,
                };
                await utils.writeFile(this.path, products);
                return {
                    mensaje: "producto actualizado",
                    producto: this.products[productIndex],
                };
            } else {
                return { mensaje: "no existe el producto solicitado" };
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProductById(id) {
        try {
            let products = await utils.readFile(this.path);
            this.products = products?.length > 0 ? products : [];
            let productIndex = this.products.findIndex((dato) => dato.id === id);
            if (productIndex !== -1) {
                let product = this.products[productIndex];
                this.products.splice(productIndex, 1);
                await utils.writeFile(this.path, products);
                return { mensaje: "producto eliminado", producto: product };
            } else {
                return { mensaje: "no existe el producto" };
            }
        } catch (error) {
            console.log(error);
        }
    }

}

export default {
    ProductManager,
};




