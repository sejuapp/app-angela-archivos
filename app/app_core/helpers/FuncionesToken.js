var CryptoJS = require("crypto-js");
const { env } = require('process');

const secret = env.SEMILLA;

function encrypt(pCadena) {
	let cadena = pCadena != null ? pCadena.toString() : null;
	if (cadena != null) {
		return CryptoJS.AES.encrypt(cadena, secret).toString();
	} else {
		return null;
	}

}

function decrypt(pDecoded) {
	let decoded = pDecoded != null ? pDecoded.toString() : null;
	if (decoded != null) {
		var bytes = CryptoJS.AES.decrypt(decoded, secret);
		return decryptedData = bytes.toString(CryptoJS.enc.Utf8);
	} else {
		return null;
	}
}

module.exports = {
	encrypt,
	decrypt
}