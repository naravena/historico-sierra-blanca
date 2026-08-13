// Vercel trata cualquier fichero en /api que exporte una función (req, res)
// como una función serverless. Express es compatible directamente: nuestra
// app real vive en backend/src/app.js y aquí solo se reexporta - así el
// mismo código sirve tanto para "node backend/server.js" en local como
// para el despliegue serverless en Vercel, sin duplicar nada.
module.exports = require("../backend/src/app");
