/**
 * @file archivo que contiene la configuración del servidor
 * @name app.js
 * @author Ivan Gonzalez <givandavid@gmail.com>
 * @copyright 2020
 **/

 require('dotenv').config();

 /**
 * Modulo de configuración del servidor
 * @module app
 *
 **/
 
 const express = require('express');
 const app = express();
 const cors = require('cors')
 const server = require('http').createServer(app);
 const morgan = require('morgan');
 const path = require('path');
 const PORT_SERVER_DEFAULT = 3400;
 
 // static files
 app.use(express.static(path.join(__dirname, 'public/front')));
 
 const routesAdminIndex = require('./app/app_core/routes/index');
 
 app.use(express.urlencoded({ extended: false }));
 app.use(express.json());
 
 app.use(express.urlencoded({
   parameterLimit: 1000000,
   limit: '100mb',
   extended: false
 }));
 
 app.use(express.json({
   parameterLimit: 1000000,
   limit: '100mb',
   extended: false
 }));
 
 
 
 app.use(cors());
 // app.use(cors({origin:["http://localhost:4200/"]}));
 
 //Libreria para que me muestre en consola las peticiones realizadas
 app.use(morgan('dev'));
 
 //Index de inicio si visitamos url principal
 app.get('/', (req, res) => {
   // res.sendFile(path.join(__dirname, './app.html'));
   res.sendFile(path.join(__dirname, './public/front/index.html'));
 });
 
 
 /**
  * Administrador URL para la app_web_cam
  */
 app.use('/api', routesAdminIndex);
 
 
 /**
  * Metodo que inicia el servidor en el puerto por defecto y el que este declarado en el arcivo .env
  */
 server.listen(process.env.PORT || PORT_SERVER_DEFAULT, () => {
   console.log(`:::::: Servidor en puerto: ${process.env.PORT || PORT_SERVER_DEFAULT}`);
 });
 
 module.exports = {
   server
 }
 