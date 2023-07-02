import express from "express";
import { ProductManager } from "./ProductManager.js";

const app = express();
const puerto = 8080;
const productManager = new ProductManager("products.json");
let products = [];

app.get("/", (req, res) => {
    res.send("hola mundo");
});

app.get("/products", async (req, res) => {
    const { limit } = req.query;
    try {
        const resultProducts = await productManager.getProducts();
        if (limit) {
            let tempArray = resultProducts.filter((dat, index) => index < limit);

            res.json({ data: tempArray, limit: limit, quantity: tempArray.length });
        } else {
            res.json({ data: resultProducts, limit: false, quantity: resultProducts.length });
        }
    } catch (err) {
        console.log(err);
    }
});

app.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;

    let product = await productManager.getProductById(pid);

    if (product) {
        res.json({ message: "listo", data: product });
    } else {
        res.json({
            message: "el producto no existe",
        });
    }
});


app.listen(puerto, () => {
    console.log(`El servidor esta corriendo en el puerto ${puerto}`);
})

