const knex = require("knex");

class ContenedorM {
    constructor (dbOptions, table){
        this.conex = knex(dbOptions);
        this.table = table;
    }

    //crear tabla Mensajes    
    async crearTablaMensajes() {
        try {
            await this.conex.schema.hasTable(this.table).then(async function (exists) {
                if (!exists) {
                    await this.conex.schema.createTable(table, function (campo) {
                        campo.increments("id").primary().notNullable();
                        campo.string("email");
                        campo.string("fecha");
                        campo.string("mensaje");
                    });
                } else {
                    console.log("La tabla MENSAJES ya existe")
                }
            });
        }
        catch (error) {
            console.error(`${error}`);
        }
        finally {
            this.conex.destroy();
        }
    }

    //devuelve todos los mensajes
    async getMensajes() {
        try {
            let rtaBD = await this.conex(this.table)
            return rtaBD;
        }
        catch (error) {
            console.error(`${error}`);
        }
        finally {
            this.conex.destroy();
        }
    };

    //agregar el mensaje a la base de datos
    async insertMensaje(objMensaje) {
        try{
            let rtaBD = await this.conex(this.tabla).insert(objMensaje);
            console.log('Mensaje agregado');
            return rtaBD;
        }
        catch(error){
            console.error(`${error}`);
        }
        finally{
            this.conex.destroy();
        }
    }
}

module.exports = ContenedorM;