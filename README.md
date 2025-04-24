# pocketbase-uploader
Node para usarse en Node-Red para crear o actualizar o eliminar registros en PocketBase.

POCKETBASE (https://pocketbase.io/)
NODE-RED (https://nodered.org/)


publicado aqui:
https://flows.nodered.org/node/node-red-contrib-pocketbase-uploader
https://www.npmjs.com/package/node-red-contrib-pocketbase-uploader


NOTA:
datos de entrada deben de venir de una funcion asi:
return [{ payload:msg.payload.rows }];