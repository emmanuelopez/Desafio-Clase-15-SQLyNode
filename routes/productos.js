const express = require('express');
const router = express.Router();
const { isAdmin } = require("../middlewares/auth")

const {Api} = require('../scripts/api'); //importo la clase api
const api = new Api(
    {
        client: "mysql",
        connection: {
          host: "127.0.0.1",
          database: "ecommerce",
          user: "root",
          password: "",
          port: 3306,
        },
        pool: { min: 0, max: 7 },
      },
      "productos"
);

//Get -> devuelve todos los productos
router.get('/productos', (req, res) =>{
    const productos = api.getAll();
    res.send(productos);
    console.log(productos);
});

//Post -> recibe y agrega un producto.
router.post('/productos', (req, res) =>{
    const producto = api.setProducto(req.body);
    req.app.io.sockets.emit("update_products", api.getAll())
    res.send(`Se agrego el producto: ${JSON.stringify(producto)}`);
    console.log(`Se agrego el producto: ${JSON.stringify(producto)}`);
});

//Get -> devuelve un producto segun su id
router.get('/productos/:id', (req, res) =>{
    const producto = api.getProductoById(req.params.id);
    res.send(producto);
    console.log(`El producto solicitado es: ${JSON.stringify(producto)}`);
});

//Put -> recibe y actualiza un producto segun su id
router.put('/productos/:id', (req, res) =>{
    const producto = api.updateProductoById(req.params.id, req.body);
    res.send((producto === undefined ? `Se actualizó el producto con id ${req.params.id}` : JSON.stringify(producto)));
    console.log((producto === undefined ? `Se actualizó el producto con id ${req.params.id}` : JSON.stringify(producto)));
});

//Delete -> elimina un producto segun su id
router.delete('/productos/:id', (req, res) =>{
    const producto = api.deleteProductoById(req.params.id);
    res.send((producto === undefined ? `Se eliminó el producto con id ${req.params.id}` : JSON.stringify(producto)));
    console.log((producto === undefined ? `Se eliminó el producto con id ${req.params.id}` : JSON.stringify(producto)));
});

module.exports = router; 