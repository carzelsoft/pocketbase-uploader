let PocketBase;
//CREADO POR CARLOS ZELAYA CARZEL@GMAIL.COM

async function loadPocketBase() {
  if (!PocketBase) {
    PocketBase = (await import('pocketbase')).default;
  }
}

module.exports = function(RED) {
    function PocketbaseUploader(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.baseUrl = config.baseUrl;
        node.user = config.user;
        node.pass = config.pass;
        node.collection = config.collection;
        node.method = config.method;  
        node.keycolumn = config.keycolumn;

        node.on('input', async (msg, send, done) => {
            if (!msg.payload) {
                node.warn("No hay msg.payload para enviar a PocketBase.");
                send(msg);
                if (done) done();
                return;
            }

            try {
             

                // Cargar PocketBase de forma dinámica
                await loadPocketBase();
                const pb = new PocketBase(node.baseUrl);

                // Autenticación como usuario
                const authData = await pb
                  .collection('users')
                  .authWithPassword(node.user, node.pass);

                let result;
                if (node.method === "create") {
                    // 1) CREATE un nuevo registro 
                    for (const j of msg.payload) {
                    result = await pb
                      .collection(node.collection)
                      .create(j);
                    }

                }
                
                else if (node.method === "update") {
                    // 2) UPDATE del primer registro de la colección
                    //    Obtenemos la primera página, 1 registro por página
                    const records = await pb
                      .collection(node.collection)
                      .getFullList(); 
                      
                    if (!records || records.length === 0) {
                        throw new Error("No hay registros en la colección para actualizar.");
                    }

                  
                    
                      
                      for (const i of records) {
                        for (const j of msg.payload) {
                         
                            if(i[node.keycolumn]==j[node.keycolumn]){

                              const recordId = i.id;  // El id del registro actual en PocketBase                            
                                result = await pb
                                .collection(node.collection)
                                .update(recordId, j);
                            }
                      }
                    }

                } else {
                    throw new Error(`Método no soportado: ${node.method}`);
                }

                // Guardamos la respuesta final
                msg.pocketbase = result;
                send(msg);
                if (done) done();

            } catch (err) {
                node.error("Error al subir a PocketBase: " + err, msg);
                if (done) done(err);
            }
        });
    }

    RED.nodes.registerType("pocketbase-uploader", PocketbaseUploader);
};
