const api = require('express').Router();

const GestorArchivosDaoRoutes = require('./all/GestorArchivosDaoRoutes');


api.use('/archivos/', GestorArchivosDaoRoutes);


module.exports = api; 