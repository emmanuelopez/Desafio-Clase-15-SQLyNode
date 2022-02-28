const knex = require('knex')

class ContenedorP{
  constructor (dbOptions, table){
    this.conex = knex(dbOptions);
    this.table = table;
  }

  //crear tabla Productos    
  async crearTablaProductos(){ 
    try {
      await this.conex.schema.hasTable(this.table).then(async function(exists) {
        if (!exists) {
          await this.conex.schema.createTable(this.table, function(campo) {
            campo.increments("id").primary().notNullable();
            campo.string("nombre");
            campo.integer("precio");
          });
        } else 
          {//console.log("La tabla PRODUCTOS ya existe, no fue creada")
          }
      });
    }
    catch(error){
        console.error(`${error}`);
    }
    finally{
        this.conex.destroy();
    }
}

  async save(object) {
    try{
      let rtaBD = await this.conex(this.table)
      .insert(object);
      console.log(`El producto se agrego con exito con id: ${rtaBD}`)
      return rtaBD;
    }
  
    catch(error){
      console.error(`${error}`);
    }
    
    finally{
      this.conex.destroy();
    }
  };

  async getById(id){
    try{
      let rtaBD = this.conex(this.table).where("id",idProducto);
      return rtaBD;
    }
    catch(error){
      console.error(`${error}`);
    }
    finally{
      this.conex.destroy();
    }
  };

  async getAll() {
    try{
      let rtaBD = await this.conex(this.table)
      return rtaBD;
    }
    catch(error){
      console.error(`${error}`);
    }
    finally{
      this.conex.destroy();
    }
  };

  async updateById(id,objeto){
    try{
      return await this.conex(this.table).where("id",id).update(objeto);
    }
    catch(error){
      console.error(`${error}`);
    }
    finally{
      this.conex.destroy();
    }
  }

  async deleteById(id) {
    try{
      return await this.conex(this.table).where('id', id).del();  
    }
    catch(error){
      console.error(`${error}`);
    }
    finally{
      this.conex.destroy();
    }    
  }
}
  
module.exports = ContenedorP;