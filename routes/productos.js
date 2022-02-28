const express = require('express');
const router = express.Router();
const { isAdmin } = require("../middlewares/auth")

const ContenedorP = require('../scripts/contenedor_producto')

const Producto = new ContenedorP(
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
router.get('/productos', async(req, res) =>{

    res.status(200).json(await Producto.getAll());
});

//Get -> devuelve un producto segun su id
router.get('/productos/:id', async (req, res) =>{
    //obtengo el id recibido por parametro
    let idProducto = parseInt(req.params.id);

    //valido que el id ingresado sea numerico
    if ( !isNaN(idProducto) ){        
        let rtaClase = await Producto.getById(idProducto);
        rtaClase != null ? res.status(200).json(rtaClase): res.status(400).json({error:'El producto no fue encontrado'});
    }else{
        res.status(404).json({error:'El id ingresado no es numerico'});
    }    
});

//Post -> recibe y agrega un producto.
router.post('/productos', async (req, res) =>{
    let objProductoBody = {...req.body};
    let objProductoNuevo =  await Producto.save(objProductoBody) 
    if(objProductoNuevo!=null){
        res.status(200).json(objProductoNuevo)
    }else{
        res.status(404).json({error:'Error al dar de alta el/los producto/s'});
    }   
});

//Put -> recibe y actualiza un producto segun su id
router.put('/productos/:id', async (req, res) =>{
    let idProducto = parseInt(req.params.id)
    let objProductoBody = {...req.body};
    let rtaClase = await Producto.updateById(idProducto,objProductoBody)
    if(rtaClase){
        res.status(200).json({status:`OK`,message:`El producto con Id ${idProducto} fue actualizado correctamente.`});
    }else{
        res.status(406).json({error:`No se encontró el producto con id: ${idProducto}`});
    }
});

//Delete -> elimina un producto segun su id
router.delete('/productos/:id', async (req, res) =>{
    //obtengo el id recibido por parametro
   let idProducto = parseInt(req.params.id);
   let rtaClase = Producto.deleteById(idProducto);
   if(rtaClase){
       res.status(200).json({status:`OK`,message:`El producto con Id ${idProducto} no existia o fue eliminado correctamente`});
   }else{
       res.status(406).json({error:`Error al querer borrar el producto`});
   }
});

module.exports = router; 