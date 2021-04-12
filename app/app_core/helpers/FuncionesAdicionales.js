/**
 * @file archivo que contiene el modulo de FuncionesAdicionales
 * @name FuncionesAdicionales.js
 * @author Ivan Gonzalez <givandavid@gmail.com>
 * @copyright 2020
 **/

const Moment = require('moment');
const MomentTimezone = require('moment-timezone');

const randomstring = require("randomstring");
const fs = require('fs')
const rmdir = require('rmdir');
const tar = require('tar-fs')
const archiver = require('archiver');

const conversor = require('conversor-numero-a-letras-es-ar');
let ClaseConversor = conversor.conversorNumerosALetras;
let miConversor = new ClaseConversor();
const path = require('path');

/**
 * Modulo de FuncionesAdicionales son funciones que se concentran en este modulo que ejecutan tareas de uso general.
 * @module FuncionesAdicionales
 *
 **/


dias = [
	{ nombre: 'Domingo', abreviatura: 'Do' },
	{ nombre: 'Lunes', abreviatura: 'Lu' },
	{ nombre: 'Martes', abreviatura: 'Ma' },
	{ nombre: 'Miércoles', abreviatura: 'Mi' },
	{ nombre: 'Jueves', abreviatura: 'Ju' },
	{ nombre: 'Viernes', abreviatura: 'Vi' },
	{ nombre: 'Sábado', abreviatura: 'Sá' },
];

meses = [
	{ nombre: 'Enero', abreviatura: 'En' },
	{ nombre: 'Febrero', abreviatura: 'Febr' },
	{ nombre: 'Marzo', abreviatura: 'Mzo' },
	{ nombre: 'Abril', abreviatura: 'Abr' },
	{ nombre: 'Mayo', abreviatura: 'My' },
	{ nombre: 'Junio', abreviatura: 'Jun' },
	{ nombre: 'Julio', abreviatura: 'Jul' },
	{ nombre: 'Agosto', abreviatura: 'Agt' },
	{ nombre: 'Septiembre', abreviatura: 'Sept' },
	{ nombre: 'Octubre', abreviatura: 'Oct' },
	{ nombre: 'Noviembre', abreviatura: 'Nov' },
	{ nombre: 'Diciembre', abreviatura: 'Dic' },
];

/**
* formatea un numero con ceros a la izquierda
* @param {string} num - numero a formatear
* @param {string} size- numero de caracteres de la cadena a retornar
* @returns {string} numero_formateado - numero formateado con la cantidad necesaria de ceros para completar el tamaño de la cadena 
**/
var padnum = function (num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
};


/**
 * 
 * @param fechaparam fecha a procesar
 * @param opciones opciones para el formato de fechas
 * @example { hora: false, separador: '/', anioPrimero: false, soloHora : false }
 */
function formatearFecha(fechaparam, opciones = null) {
	if (fechaparam) {
		let fecha = new Date(fechaparam);
		let soloHora = opciones.soloHora != null ? opciones.soloHora : false;

		let separador = opciones != null && opciones.separador != null ? opciones.separador : '/';
		let hora = opciones != null && opciones.hora != null ? opciones.hora : false;
		let anioPrimero = opciones != null && opciones.anioPrimero != null ? opciones.anioPrimero : false;

		var cadena = ""

		let mes = this.padnum(fecha.getMonth() + 1, 2);
		let dia = this.padnum(fecha.getDate(), 2);
		let hora_formateada = this.padnum(fecha.getHours(), 2);
		let minuto = this.padnum(fecha.getMinutes(), 2);
		let segundos = this.padnum(fecha.getSeconds(), 2);

		if (anioPrimero) {
			cadena = [fecha.getFullYear(), mes, dia].join(separador);
		} else {
			cadena = [dia, mes, fecha.getFullYear()].join(separador);
		}

		if (hora || soloHora) {
			if (soloHora) {
				cadena = hora_formateada + ':' + minuto + ':' + segundos;
			} else {
				cadena = cadena + " " + hora_formateada + ':' + minuto + ':' + segundos;
			}
		}

		return cadena;
	}
	else {
		return null;
	}
}

/**
 * 
 * @param fechaparam fecha a procesar
 * @param opciones opciones para el formato de fechas
 * @example { hora: false, separador: '/', anioPrimero: false }
 */
function formatearFechaMasOpciones(fechaparam, opciones = null) {
	if (fechaparam) {
		let fecha = new Date(fechaparam);

		const numDiaSemana = fecha.getUTCDay();
		const numMonth = fecha.getMonth() + 1;

		const objDia = dias[numDiaSemana];
		const objMes = meses[numMonth];

		const anioLetras = miConversor.convertToText(fecha.getFullYear());
		const diaLetras = miConversor.convertToText(fecha.getDate());

		let separador = opciones != null && opciones.separador != null ? opciones.separador : '/';
		let anioPrimero = opciones != null && opciones.anioPrimero != null ? opciones.anioPrimero : false;

		var fechaFinal = ""
		var horaFinal = ""

		let mes = padnum(fecha.getMonth() + 1, 2);
		let dia = padnum(fecha.getDate(), 2);
		let hora_formateada = padnum(fecha.getHours(), 2);
		let minuto = padnum(fecha.getMinutes(), 2);
		let segundos = padnum(fecha.getSeconds(), 2);

		if (anioPrimero) {
			fechaFinal = [fecha.getFullYear(), mes, dia].join(separador);
		} else {
			fechaFinal = [dia, mes, fecha.getFullYear()].join(separador);
		}

		horaFinal = hora_formateada + ':' + minuto + ':' + segundos;

		const respuesta = {
			diaObj: objDia,
			mesObj: objMes,

			diaLetra: diaLetras,
			diaNum: dia,
			mesNum: mes,

			anioNum: fecha.getFullYear(),
			anioLetras: anioLetras,
			fechaFormat: fechaFinal,
			horaFormat: horaFinal
		}


		return respuesta;
	}
	else {
		return null;
	}
}

function obtenerInicioFinMes(fechaparam, parametros) {
	let fecha = new Date(fechaparam);
	var dateFinFrom = Moment(fecha).endOf('month').format();;
	var dateInitFrom = Moment(fecha).startOf('month').format();;

	const respuestaFecha1 = formatearFechaMasOpciones(dateFinFrom, parametros);
	const respuestaFecha2 = formatearFechaMasOpciones(dateInitFrom, parametros);

	const respuesta = {
		fi: respuestaFecha1.fechaFormat,
		ff: respuestaFecha2.fechaFormat
	}

	return respuesta;

}



/**
* Permite encontrar la diferencia en años entre dos fechas determinadas
* @param {Object} fecha_desde - fecha inicial desde la que se va a hacer la diferencia
* @param {Object} fecha_hasta - fecha hasta la que se hara la diferencia
* @returns {number} anios - años obtenidos como diferencia 
**/
function obtenerDiferenciaFechas(fecha_desde, fecha_hasta) {

	var fecha_fin = fecha_hasta ? fecha_hasta : new Date();

	var fecha_inicio = Moment([fecha_desde.getFullYear(), fecha_desde.getMonth(), fecha_desde.getDate()]);
	var fecha_ultima = Moment([fecha_fin.getFullYear(), fecha_fin.getMonth(), fecha_fin.getDate()]);

	var anios = fecha_ultima.diff(fecha_inicio, "years");
	console.log(anios);

	return anios;
}



function agrupar(lst, llave) {
	let lstNueva = [];

	for (const item of lst) {
		let encontrado = false;

		for (const item2 of lstNueva) {
			if (item[llave] == item2[llave]) {
				encontrado = true;
				break;
			}
		}

		if (encontrado == false) {
			let nObjeto = JSON.parse(JSON.stringify(item));
			lstNueva.push(nObjeto);
		}
	}

	return lstNueva;
}



function setearDatos(modelo, modeloDatos, lstDate = []) {
	if (modelo != null && modeloDatos != null) {
		for (let item in modelo) {
			for (let item2 in modeloDatos) {
				if (item == item2) {
					let fecha = lstDate.find(date => date == item);
					if (fecha == null) {
						modelo[item] = modeloDatos[item2];
					} else {
						modelo[item] = modeloDatos[item2] != null ? moment(modeloDatos[item2]) : null;
					}
					break;
				}
			}
		}
	}

}


function darNombreCodigo() {
	let cadena = randomstring.generate({ length: 7, charset: 'alphanumeric' }) + '-' + randomstring.generate({ length: 7, charset: 'alphabetic' }) + '-' + randomstring.generate({ length: 7, charset: 'numeric' }) + '-' + randomstring.generate({ length: 7, charset: 'hex' });
	return cadena;
}



function crearCarpeta(dirPath) {
	try {
		fs.mkdirSync(dirPath);
	} catch (err) {
		if (err.code !== 'EEXIST') {
			throw err
		}
	}
}


function eliminarArchivo(ruta) {
	return new Promise((resolve, reject) => {
		try {
			if (ruta != null && ruta != '') {
				let existe = fs.existsSync(ruta);

				if (existe) {
					fs.unlinkSync(ruta);
				}
			} else {
				resolve(false);
			}

			resolve(true);
		} catch (error) {
			console.log('Error al tratar de eliminar el archivo.');
			resolve(false);
		}
	});
}

function eliminarCarpeta(ruta) {
	return new Promise((resolve, reject) => {
		try {
			if (ruta != null && ruta != '') {
				rmdir(ruta, function (err, dirs, files) {
					if (err) {
						resolve(false);
					} else {
						resolve(true);
					}
				});
			} else {
				resolve(false);
			}

		} catch (error) {
			reject(error);
			throw error
		}
	});
}


function fechaActualColombia() {
	let fechaActual = MomentTimezone().tz("America/Bogota").format();
	return fechaActual;
}

function fechaFormatColombia(param) {
	let fecha = MomentTimezone(param).tz("America/Bogota").format();
	return fecha;
}


/**
 * Metodo que genera una cadena random con los numeros asignados
 * @param {*} pBloques numer de bloques
 * @param {*} pSeparador separador de los bloques
 * @param {*} pLength cantidad de caracteres por bloque
 * @param {*} pCharset tipos de como se va a contener los caracteres alphanumeric, alphabetic, numeric, hex
 */
function getRandomString(pBloques, pSeparador, pLength, pCharset) {

	let retorno = '';
	let bloques = [];


	for (let index = 0; index < pBloques; index++) {
		const cadena = randomstring.generate({ length: pLength, charset: pCharset });
		bloques.push(cadena);
	}

	retorno = bloques.join(pSeparador);

	return retorno;
}



function comprimirCarpeta(rutaComprimir, rutaComprimido) {
	return new Promise((resolve, reject) => {
		try {

			let escritura = tar.pack(rutaComprimir).pipe(fs.createWriteStream(rutaComprimido));
			escritura.on('finish', function () {
				let arc = fs.readFileSync(rutaComprimido);
				resolve(arc);
			});

		} catch (error) {
			reject(error);
		}

	});

}


function quitarExcesoEspacios(data) {
	if (typeof data === 'string') {
		return data.replace(/ +/g, " ").trim();
	} else if (typeof data === 'object') {

		for (let item in data) {
			const valor = data[item];
			if (typeof valor === 'string') {
				const nValor = valor.replace(/ +/g, " ").trim();
				data[item] = nValor;
			}
		}

		return data;
	}
}


function quitarTodosLosEspacios(data) {
	if (typeof data === 'string') {
		return data.replace(/ /g, "").trim();
	} else if (typeof data === 'object') {

		for (let item in data) {
			const valor = data[item];
			if (typeof valor === 'string') {
				const nValor = valor.replace(/ /g, "").trim();
				data[item] = nValor;
			}
		}

		return data;
	}
}




function crearArchivo(ruta, nomArchivo, ext, contenido) {
	return new Promise((resolve, reject) => {
		let rutaFinal = ruta + nomArchivo + ext;
		fs.writeFile(rutaFinal, contenido, error => {
			if (error) {
				reject(error);
			}
			else {
				resolve(true);
			}
		});
	});
}

function parseJSON(data) {
	return JSON.parse(JSON.stringify(data));
}


function limpiarTemporales(files) {
	let nFiles = null;

	for (const key in files) {
		nFiles = files[key];
	}

	if (!(nFiles.length > 0)) {
		let miArchivo = null;
		for (const key in files) {
			miArchivo = files[key];
		}
		nFiles = [miArchivo];
	}


	for (var item of nFiles) {
		if (item) {
			fs.unlinkSync(item.path);
		}
	}

	return { "message": "archivos borrados" };
}

function armarJsonArchivosFileNameBase64(archivos) {
	let archivosNuevos = new Array();

	for (const key in archivos) {
		let miArchivo = archivos[key];

		let nombre = miArchivo.name.replace(/ /g, "_");

		let buff = new Buffer(key, 'base64');
		let base64data = buff.toString('ascii');
		base64data = JSON.parse(base64data);

		let NUEVONOMBRE = base64data.nuevo_nombre;//se estable ce en null para que conserve el nombre original
		if (NUEVONOMBRE != null) {
			const extension = path.extname(miArchivo.path);
			nombre = NUEVONOMBRE + extension;
		}

		const tipo = base64data.tipo != null && base64data.tipo != '' ? base64data.tipo : null
		const carpeta = base64data.carpeta != null && base64data.carpeta != '' ? base64data.carpeta.trim() : null;

		archivosNuevos.push({ "archivo": miArchivo, "nombre": nombre, carpeta: carpeta, tipo: tipo });
	}

	const retorno = {
		archivos: archivosNuevos,
	}

	return retorno;

}

function armarJsonArchivosMultiplesFileNameBase64(archivos) {
	let nArchivos = null;

	for (const key in archivos) {
		nArchivos = archivos[key];
	}

	if (!(nArchivos.length > 0)) {
		let miArchivo = null;
		for (const key in archivos) {
			miArchivo = archivos[key];
		}
		nArchivos = [miArchivo];
	}

	let archivosNuevos = new Array();

	for (const miArchivo of nArchivos) {
		let nombre = miArchivo.name.replace(/ /g, "_");

		let buff = new Buffer.from(miArchivo.fieldName, 'base64');
		let base64data = buff.toString('ascii');
		base64data = JSON.parse(base64data);

		let NUEVONOMBRE = base64data.nuevo_nombre;//se estable ce en null para que conserve el nombre original
		if (NUEVONOMBRE != null) {
			const extension = path.extname(miArchivo.path);
			nombre = NUEVONOMBRE + extension;
		}

		const tipo = base64data.tipo != null && base64data.tipo != '' ? base64data.tipo : null
		const carpeta = base64data.carpeta != null && base64data.carpeta != '' ? base64data.carpeta.trim() : null;

		archivosNuevos.push({ "archivo": miArchivo, "nombre": nombre, carpeta: carpeta, tipo: tipo });
	}

	const retorno = {
		archivos: archivosNuevos,
	}

	return retorno;

}

function cargarArchivoServidor(rutaLeer, directorioCrear) {
	var buffer = fs.readFileSync(rutaLeer);
	fs.writeFileSync(directorioCrear, buffer);
}


module.exports = {
	padnum,
	formatearFecha,
	obtenerDiferenciaFechas,
	agrupar,
	setearDatos,
	darNombreCodigo,
	crearCarpeta,
	eliminarArchivo,
	eliminarCarpeta,
	fechaActualColombia,
	getRandomString,
	comprimirCarpeta,
	quitarExcesoEspacios,
	quitarTodosLosEspacios,
	fechaFormatColombia,
	formatearFechaMasOpciones,
	obtenerInicioFinMes,
	crearArchivo,
	parseJSON,
	limpiarTemporales,
	armarJsonArchivosFileNameBase64,
	armarJsonArchivosMultiplesFileNameBase64,
	cargarArchivoServidor
}
