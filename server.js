const express = require('express');
const path = require('path');
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

//Obtengo los productos
const productosRouter = require('./routes/productos');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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


app.use(function (req, res, next) {
    req.user = {
      name: "Ema",
      is_admin: true,
    };
    next();
});

app.use('/api', productosRouter);

const date = new Date();
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