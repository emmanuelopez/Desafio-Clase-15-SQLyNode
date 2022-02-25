const Contenedor = require("../DB")


class Api {
  constructor(dbOptions, table) {
    this.conection = dbOptions;
    this.table = table;
  }

  async getAll(db, nameTable) {
      //return this.productos;
  }

  getProductoById(id) {

      const resultado = this.productos.find(idBuscado => idBuscado.id === parseInt(id));
      if (resultado === undefined) {
          return { error: 'producto no encontrado' };
      } else {
          return resultado;
      }
  }

  setProducto(producto) {

      const id = this.productos.length + 1;

      if (producto.title && producto.price && producto.thumbnail) {
          const contenedor = new Contenedor(this.conection);
          contenedor
            .isExistTable(this.table)
            .then((isExist) => (isExist ? true : contenedor.createTable()))
            .then(() => contenedor.createarticles(producto))
            .then(() => contenedor.selectArticles())
            .then((rows) => console.log(rows))
            .finally(() => contenedor.destroy());
      } else {
          return 'Campo de producto faltante';
      }
  }

  updateProductoById(id, producto) {
      const resultado = this.productos.find(idBuscado => idBuscado.id === parseInt(id));

      if (resultado === undefined) {
          return { error: 'producto no encontrado' };
      } else {
          if (producto.title && producto.price && producto.thumbnail) {
              Object.defineProperties(this.productos.find(idBuscado => idBuscado.id === parseInt(id)), {
                  'title': {
                      value: producto.title
                  },
                  'price': {
                      value: producto.price
                  },
                  'thumbnail': {
                      value: producto.thumbnail
                  }
              })
          } else {
              return 'No es el formato de producto que podes ingresar';
          }
      }
  }

  deleteProductoById(id) {
      const resultado = this.productos.find(idBuscado => idBuscado.id === parseInt(id));

      if (resultado === undefined) {
          return { error: 'producto no encontrado' };
      } else {
          this.productos = this.productos.filter(idEliminado => idEliminado.id !== parseInt(id));
      }
  }

  close() {
    this.conexion.destroy();
  }
}

module.exports = {Api}; 