const Fs = require("fs");
const Excel = require('exceljs');
const path = require('path');
let estadoProceso = 'SIN INICIAR';

async function actionGestionarArchivos(req, res) {
	req.setTimeout(0);
	const archivos = req.files;
	try {
		const body = JSON.parse(req.body.data);
		const compararSoloCon1Registro = body.compararSoloCon1Registro;

		const REFERENCIAS = await armarJsonArchivosFileNameBase64(archivos);
		const procesados = await leerArchivo(REFERENCIAS.lstReferencias, compararSoloCon1Registro);
		limpiarTemporales(archivos);

		const arc = await escribirArchivo(procesados, compararSoloCon1Registro);

		estadoProceso = 'SIN INICIAR';

		res.writeHead(200, { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'x-filename': 'midocumento' + '.xlsx', 'access-control-expose-headers': '*' });
		res.end(arc, 'binary');

	} catch (error) {
		limpiarTemporales(archivos);
		estadoProceso = error.message;
		res.status(500).send({ title: '', message: error.message });
	}
};


function armarJsonArchivosFileNameBase64(archivos) {
	estadoProceso = 'Identificando archivos';
	let lstArchivosReferenciados = new Array();

	for (const key in archivos) {
		let miArchivo = archivos[key];

		let buff = new Buffer(key, 'base64');
		let base64data = buff.toString('ascii');
		base64data = JSON.parse(base64data);


		let TIPODOCUMENTO = base64data.tipo_archivo;//identifica el tipo de archivo
		let NUEVONOMBRE = base64data.nuevo_nombre;//se estable ce en null para que conserve el nombre original
		if (NUEVONOMBRE != null) {
			nombre = NUEVONOMBRE;
		}

		lstArchivosReferenciados.push({ "path": miArchivo.path, "tipo": TIPODOCUMENTO });
	}

	const retorno = {
		lstReferencias: lstArchivosReferenciados,
	}

	return retorno;

}


async function leerArchivoTxt(lstArchivosReferenciados, compararSoloCon1Registro) {
	const separador = ';';
	console.log('hora inicio lectura ::> ', new Date());

	const SEG_COVID = lstArchivosReferenciados.find(mif => mif.tipo == 'SEG_COVID');
	const TIC = lstArchivosReferenciados.find(mif => mif.tipo == 'TIC');

	const SEG_COVID_COL_TIPO_DOC = 0;
	const SEG_COVID_COL_NUM_DOC = 1;
	const SEG_COVID_COL_NOMBRES_APELLIDOS = [2, 3, 4, 5];

	const TIC_COL_NUM_DOC = 5;
	const TIC_COL_NUM_TEL = 15;
	const TIC_COL_FECHA_HORA = 3;

	if (SEG_COVID && TIC) {
		const filaInicio = 1;
		estadoProceso = 'Cargando en memoria archivo SEG COVID';

		let SEG_COVID_DATA_FILE = Fs.readFileSync(SEG_COVID.path, 'utf8');
		SEG_COVID_DATA_FILE = SEG_COVID_DATA_FILE.toString().split('\n');

		estadoProceso = 'Cargando en memoria archivo TIC';
		let TIC_DATA_FILE = Fs.readFileSync(TIC.path, 'utf8')
		TIC_DATA_FILE = TIC_DATA_FILE.toString().split('\n');

		let index = 0;

		const lstNoExisten = [];
		const lstExistenMasDeUno = [];

		for (const element of SEG_COVID_DATA_FILE) {

			if (index >= filaInicio) {
				const columnas = element.split(separador);
				let columnaComparador = columnas[SEG_COVID_COL_NUM_DOC];
				columnaComparador = columnaComparador != null ? columnaComparador.replace(/ +/g, '').trim() : '';
				if (columnaComparador != '') {
					const lstNombres = [];
					for (const itemNomApe of SEG_COVID_COL_NOMBRES_APELLIDOS) {
						const valor = columnas[itemNomApe];
						lstNombres.push(valor);
					}

					const nombresConcatenados = lstNombres.join(' ');

					let nElemento = {
						tipo_doc: columnas[SEG_COVID_COL_TIPO_DOC],
						num_doc: columnaComparador,
						nom_ape: nombresConcatenados,
						fecha_ultima_gestion: 0,
						cant_apariciones: 0,
						telefono: 0
					}

					let resultados = null;

					if (compararSoloCon1Registro) {
						resultados = TIC_DATA_FILE.find(mif => {
							const columnas = mif.split(separador);
							let numDoc = columnas[TIC_COL_NUM_DOC];
							numDoc = numDoc != null ? numDoc.toString().replace(/ +/g, '').trim() : '';

							return numDoc == columnaComparador;
						});
					} else {
						resultados = TIC_DATA_FILE.filter(mif => {
							const columnas = mif.split(separador);
							let numDoc = columnas[TIC_COL_NUM_DOC];
							numDoc = numDoc != null ? numDoc.toString().replace(/ +/g, '').trim() : '';

							return numDoc == columnaComparador;
						});
					}



					if ((compararSoloCon1Registro && resultados == null) || (!compararSoloCon1Registro && resultados.length == 0)) {
						nElemento.telefono = '3000000000';
						lstNoExisten.push(nElemento);
					} else if (resultados.length > 1) {

						const lstTelefonos = [];
						const lstFechas = [];
						for (const miAparicion of resultados) {
							const columnas = miAparicion.split(separador);
							let tel = columnas[TIC_COL_NUM_TEL];
							tel = tel != null ? tel.replace(/ +/g, '').trim() : '';
							const resTel = lstTelefonos.find(miF => miF == tel);
							if (resTel == null) {
								lstTelefonos.push(tel);
							}

							let fyh = columnas[TIC_COL_FECHA_HORA];
							fyh = new Date(fyh);
							lstFechas.push(fyh);
						}

						const telefonos = lstTelefonos.join(',');
						nElemento.telefono = telefonos;

						lstFechas.sort((a, b) => b.getTime() - a.getTime());
						nElemento.fecha_ultima_gestion = lstFechas[0];
						nElemento.cant_apariciones = lstFechas.length;

						lstExistenMasDeUno.push(nElemento);
					}
				}

				const filaReal = index - filaInicio;

				estadoProceso = `Procesando fila de archivo ${filaReal}`;
				// console.log('::> ', estadoProceso);
			}

			index++;
		}

		const retorno = {
			lstNoExisten: lstNoExisten,
			lstExistenMasDeUno: lstExistenMasDeUno
		}
		console.log('hora fin lectura ::> ', new Date());
		return retorno
	}
}

async function leerArchivo(lstArchivosReferenciados, compararSoloCon1Registro) {

	console.log('hora inicio lectura ::> ', new Date());

	const SEG_COVID = lstArchivosReferenciados.find(mif => mif.tipo == 'SEG_COVID');
	const TIC = lstArchivosReferenciados.find(mif => mif.tipo == 'TIC');

	const SEG_COVID_COL_TIPO_DOC = 'A';
	const SEG_COVID_COL_NUM_DOC = 'B';
	const SEG_COVID_COL_NOMBRES_APELLIDOS = ['C', 'D', 'E', 'F'];

	const TIC_COL_NUM_DOC = 'F';
	const TIC_COL_NUM_TEL = 'P';
	const TIC_COL_FECHA_HORA = 'D';

	if (SEG_COVID && TIC) {
		const filaInicio = 1;
		estadoProceso = 'Cargando en memoria archivo SEG COVID';
		const workbook_SEG_COVID = new Excel.Workbook();
		await workbook_SEG_COVID.xlsx.readFile(SEG_COVID.path);
		const worksheet_SEG_COVID = workbook_SEG_COVID.getWorksheet(1);

		estadoProceso = 'Cargando en memoria archivo TIC';
		const workbook_TIC = new Excel.Workbook();
		await workbook_TIC.xlsx.readFile(TIC.path);
		const worksheet_TIC = workbook_TIC.getWorksheet(1);

		let index = 0;

		const lstNoExisten = [];
		const lstExistenMasDeUno = [];

		for (const element of worksheet_SEG_COVID._rows) {

			if (index >= filaInicio) {

				let columnaComparador = element.getCell(SEG_COVID_COL_NUM_DOC).value;
				columnaComparador = columnaComparador != null? columnaComparador.toString().replace(/ +/g, '').trim() : '';
				if (columnaComparador != '') {
					const lstNombres = [];
					for (const itemNomApe of SEG_COVID_COL_NOMBRES_APELLIDOS) {
						const valor = element.getCell(itemNomApe).value;
						lstNombres.push(valor);
					}

					const nombresConcatenados = lstNombres.join(' ');

					let nElemento = {
						tipo_doc: element.getCell(SEG_COVID_COL_TIPO_DOC).value,
						num_doc: columnaComparador,
						nom_ape: nombresConcatenados,
						fecha_ultima_gestion: 0,
						cant_apariciones: 0,
						telefono: 0
					}

					let resultados = null;

					if (compararSoloCon1Registro) {
						resultados = worksheet_TIC._rows.find(mif => {
							let numDoc = mif.getCell(TIC_COL_NUM_DOC).value;
							numDoc = numDoc != null ? numDoc.toString().replace(/ +/g, '').trim() : '';

							return numDoc == columnaComparador;
						});
					} else {
						resultados = worksheet_TIC._rows.filter(mif => {
							let numDoc = mif.getCell(TIC_COL_NUM_DOC).value;
							numDoc = numDoc != null ? numDoc.toString().replace(/ +/g, '').trim() : '';

							return numDoc == columnaComparador;
						});
					}



					if ((compararSoloCon1Registro && resultados == null) || (!compararSoloCon1Registro && resultados.length == 0)) {
						nElemento.telefono = '3000000000';
						lstNoExisten.push(nElemento);
					} else if (resultados.length > 1) {

						const lstTelefonos = [];
						const lstFechas = [];
						for (const miAparicion of resultados) {
							let tel = miAparicion.getCell(TIC_COL_NUM_TEL).value;
							tel = tel != null ? tel.replace(/ +/g, '').trim() : '';
							const resTel = lstTelefonos.find(miF => miF == tel);
							if (resTel == null) {
								lstTelefonos.push(tel);
							}

							let fyh = miAparicion.getCell(TIC_COL_FECHA_HORA).value;
							fyh = new Date(fyh);
							lstFechas.push(fyh);
						}

						const telefonos = lstTelefonos.join(',');
						nElemento.telefono = telefonos;

						lstFechas.sort((a, b) => b.getTime() - a.getTime());
						nElemento.fecha_ultima_gestion = lstFechas[0];
						nElemento.cant_apariciones = lstFechas.length;

						lstExistenMasDeUno.push(nElemento);
					}
				}
				estadoProceso = 'Procesando fila de archivo ' + index;
			}

			index++;
		}

		const retorno = {
			lstNoExisten: lstNoExisten,
			lstExistenMasDeUno: lstExistenMasDeUno
		}
		console.log('hora fin lectura ::> ', new Date());
		return retorno
	}
}

async function escribirArchivo(data, compararSoloCon1Registro) {
	estadoProceso = 'Escribiendo archivo de respuesta';
	console.log('hora inicio escritura ::> ', new Date());
	const workbook = new Excel.Workbook();
	workbook.addWorksheet('sin_registro');

	const worksheet = workbook.getWorksheet(1);
	let worksheet2 = null;

	if (compararSoloCon1Registro == false) {
		workbook.addWorksheet('con_mas_de_1_registro');
		worksheet2 = workbook.getWorksheet(2);
	}

	const filaInicio = 1;
	let filaSig = filaInicio;

	const letra_sin_gestion_TD = 'A';
	const letra_sin_gestion_NUM_DOC = 'B';
	const letra_sin_gestion_NOM_APE = 'C';
	const letra_sin_gestion_NUM_TEL = 'D';


	worksheet.getCell(`${letra_sin_gestion_TD}${filaSig}`).value = `TD`;
	worksheet.getCell(`${letra_sin_gestion_NUM_DOC}${filaSig}`).value = `NUM DOC`;
	worksheet.getCell(`${letra_sin_gestion_NOM_APE}${filaSig}`).value = `NOMBRES Y APELLIDOS`;
	worksheet.getCell(`${letra_sin_gestion_NUM_TEL}${filaSig}`).value = `NUM TEL`;
	filaSig++;

	for (const item of data.lstNoExisten) {
		worksheet.getCell(`${letra_sin_gestion_TD}${filaSig}`).value = item.tipo_doc;
		worksheet.getCell(`${letra_sin_gestion_NUM_DOC}${filaSig}`).value = item.num_doc;
		worksheet.getCell(`${letra_sin_gestion_NOM_APE}${filaSig}`).value = item.nom_ape;
		worksheet.getCell(`${letra_sin_gestion_NUM_TEL}${filaSig}`).value = item.telefono;


		filaSig++;
	}

	if (worksheet2 != null) {
		const filaInicioH2 = 1;
		let filaSigH2 = filaInicioH2;

		const letra_mas_de_uno_TD = 'A';
		const letra_mas_de_uno_NUM_DOC = 'B';
		const letra_mas_de_uno_NOM_APE = 'C';
		const letra_mas_de_uno_NUM_TEL = 'D';
		const letra_mas_de_uno_ULT_GESTION = 'E';
		const letra_mas_de_uno_TOTAL_APARICIONES = 'F';

		worksheet2.getCell(`${letra_mas_de_uno_TD}${filaSigH2}`).value = `TD`;
		worksheet2.getCell(`${letra_mas_de_uno_NUM_DOC}${filaSigH2}`).value = `NUM DOC`;
		worksheet2.getCell(`${letra_mas_de_uno_NOM_APE}${filaSigH2}`).value = `NOMBRES Y APELLIDOS`;
		worksheet2.getCell(`${letra_mas_de_uno_NUM_TEL}${filaSigH2}`).value = `NUM TEL`;
		worksheet2.getCell(`${letra_mas_de_uno_ULT_GESTION}${filaSigH2}`).value = `ULTIMA GESTIÓN`;
		worksheet2.getCell(`${letra_mas_de_uno_TOTAL_APARICIONES}${filaSigH2}`).value = `TOTAL APARICIONES`;

		filaSigH2++;

		for (const item of data.lstExistenMasDeUno) {
			worksheet2.getCell(`${letra_mas_de_uno_TD}${filaSigH2}`).value = item.tipo_doc;
			worksheet2.getCell(`${letra_mas_de_uno_NUM_DOC}${filaSigH2}`).value = item.num_doc;
			worksheet2.getCell(`${letra_mas_de_uno_NOM_APE}${filaSigH2}`).value = item.nom_ape;
			worksheet2.getCell(`${letra_mas_de_uno_NUM_TEL}${filaSigH2}`).value = item.telefono;
			worksheet2.getCell(`${letra_mas_de_uno_ULT_GESTION}${filaSigH2}`).value = item.fecha_ultima_gestion;
			worksheet2.getCell(`${letra_mas_de_uno_TOTAL_APARICIONES}${filaSigH2}`).value = item.cant_apariciones;

			filaSigH2++;
		}
	}



	const arc = await workbook.xlsx.writeBuffer();
	console.log('hora fin escritura ::> ', new Date());
	return arc;
}

function limpiarTemporales(files) {

	for (var indice in files) {
		var auxiliar = files[indice];
		if (auxiliar) {
			Fs.unlinkSync(auxiliar.path);
		}
	}

	return { "message": "archivos borrados" };
}


async function actionConsultarEstadoProceso(req, res) {
	try {

		let estado = `Estado: ${estadoProceso}`;

		const respuesta = {
			estadoProceso: estado
		}
		res.status(200).json(respuesta);
	} catch (error) {
		res.status(500).send({ title: '', message: error.message });
	}
};

module.exports = {
	actionGestionarArchivos,
	actionConsultarEstadoProceso 
}
