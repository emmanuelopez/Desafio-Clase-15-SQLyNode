class Api {

    constructor() {
      this.productos = [
        {
          title:"Lovaglio Malbec",
          price:1500,
          thumbnail:"/images/L-Malbec.jpg"
        },
      ];
    }
  
  
    getAll() {
        return this.productos;
    }
  
    getById(id) {
  
        const resultado = this.productos.find(idBuscado => idBuscado.id === parseInt(id));
        if (resultado === undefined) {
            return { error: 'producto no encontrado' };
        } else {
            return resultado;
        }
    }
  
    save(producto) {
  
        const id = this.productos.length + 1;
  
        if (producto.title && producto.price && producto.thumbnail) {
            this.productos.push(Object.defineProperty(producto, 'id', {
                value: id,
                writable: true,
                configurable: true,
                enumerable: true
            }));
  
            return this.productos[id - 1];
        } else {
            return 'Ingresaste un formato incorrecto de producto';
        }
    }
  
    updateById(id, producto) {
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
  
    deleteById(id) {
        const resultado = this.productos.find(idBuscado => idBuscado.id === parseInt(id));
  
        if (resultado === undefined) {
            return { error: 'producto no encontrado' };
        } else {
            this.productos = this.productos.filter(idEliminado => idEliminado.id !== parseInt(id));
        }
    }
  }
  
  module.exports = {Api}; 