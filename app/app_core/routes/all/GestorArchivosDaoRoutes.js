const Routes = require('express').Router();
const Multipart = require('connect-multiparty');

const multipartMiddleware = Multipart();

const GestorArchivosController = require('../../controller/GestorArchivosController');

Routes.post('/action-gestionar-archivos', [multipartMiddleware], GestorArchivosController.actionGestionarArchivos);
Routes.get('/action-consultar-estado-proceso', GestorArchivosController.actionConsultarEstadoProceso);


module.exports = Routes;
