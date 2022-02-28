const express = require('express');
const path = require('path');
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

//Obtengo los productos
const productosRouter = require('./routes/productos');
const { isConstructorDeclaration } = require('typescript')

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', productosRouter);

const ContenedorP = require('./scripts/contenedor_producto')
const ContenedorM = require('./scripts/contenedor_mensaje')

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


//creo la tabla productos
(async () => {
  try {
    await Producto.crearTablaProductos();
  } catch (err) {
    console.error(err);
  }
})();

//obtengo listado de productos
//let listadoProductos = Producto.getProductos();
let listadoProductos
(async () => {
  try {
    listadoProductos = await Producto.getAll();
  } catch (err) {
    console.error(err);
  }
})();

const Mensaje = new ContenedorM(
  {
    client: "sqlite3",
    connection: { filename: "./mydb.sqlite" },
  },
  "mensajes"
);

//creo la tabla mensajes
(async () => {
  try {
    await Mensaje.crearTablaMensajes();
  } catch (err) {
    console.error(err);
  }
})();

const date = new Date();
let listaMensajes = [{ 
  email:"Admin",
  fecha: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
  mensaje: "Bienvenido al chat!!"
}];
(async () => {
  try {
    listaMensajes = await Mensaje.getMensajes();
  } catch (err) {
    console.error(err);
  }
})();


app.use(function (req, res, next) {
    req.user = {
      name: "Ema",
      is_admin: true,
    };
    next();
});


const MENSAJES = [
  {
      email: "Admin",
      message: "Bienvenido al centro de mensajes!",
      fecha: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
  },
]

io.on("connection", (socket) => {
    console.log('Un cliente se ha conectado con id: ', socket.id);
    //agrego el nuevo mensaje enviado
    socket.on("new_message", data => {
      MENSAJES.push(data);
      io.sockets.emit("messages", MENSAJES);
  })
  io.sockets.emit("messages", MENSAJES);
})

app.io = io;

const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => console.log(`Servidor listo en el puerto ${PORT} ...`))
server.on('error', error => console.log(`Error en el servidor... Error: ${error}`));