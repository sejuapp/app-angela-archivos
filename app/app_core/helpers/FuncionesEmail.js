const Nodemailer = require('nodemailer');


async function enviarEmail(data) {
  return new Promise((resolve, reject) => {

    // Tipo de conexión: IMAP o POP3


    const htmlCorreo = data.htmlCorreo;
    const user = data.user_correo != null ? data.user_correo : 'ingivan@uzlets.com';
    const pass = data.pass_correo != null ? data.pass_correo : '!G4XS1UE!8r$8x';
    const destino = data.destino;
    const asunto = data.asunto;

    const transporter = Nodemailer.createTransport({
      host: 'mail.uzlets.com',
      // service: 'Office365',
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: pass
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true,
      secureConnection: false,
      //tls: { ciphers: 'SSLv3' },
      // requireTLS: false
    });



    var mailOptions = {
      from: user,
      to: destino,
      subject: asunto,
      html: htmlCorreo,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      try {
        console.log(info);
        if (error) {
          resolve({ "message": error.message });
          reject(error);
        } else {
          resolve({ "message": "mensaje enviado" });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};


function getPlantilla(pUrlActivacion, clave) {

  const urlActivacion = `${pUrlActivacion}`;

  return `
	
	<div style="background-color:#eff1f4;margin:0!important;padding:0!important">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tbody>

      <tr>
        <td bgcolor="#fbe5e7" align="center" style="padding:0px 10px 0px 10px">

          <table border="0" cellpadding="0" cellspacing="0" width="100%"
            style="max-width:600px;background-color:#ffffff;border-top:solid 1px #e0e3eb;border-left:solid 1px #e0e3eb;border-right:solid 1px #e0e3eb;border-radius:5px 5px 0px 0px;overflow:hidden;width:100%">
            <tbody>
              <tr>
                <td align="left" valign="top" style="text-align:left">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tbody>
                      <tr>
                        <td height="40" style="font-size:15px;line-height:15px">&nbsp;</td>
                      </tr>
                      <tr>
                        <td valign="top" align="center" style="text-align:center;padding:0px 40px">
                          <img
                            src="https://ci6.googleusercontent.com/proxy/K1xDAcVZbLef2Wt5sn7wDIvbB9YK6ZAynFDTmkluVMMNu82X3OcDZyTqTXuuw7015E9HY6czvmm66Ch6jvKnJuJV3JjSinylv3qpfHkSFBU3SZBh0yzhXmMXCu9ifk7xGWg-eYrs9uxEiiZIa47Si_rJHwV_t22VNE8HGoonWoIPwcVbfJHP-rxbj0UdHzzzpqTPQbOJ8h-elS-ARkWOIedIeNXSf7NaL864APQn-u-2LzJjxy9Wm7JyRa7EwlNdyUah1F94LMmKCiHYMncO0awMRMw=s0-d-e1-ft#http://trk.account.stripchat.com/15f8da061/e9db141606e6e713/3Ft1NxdbPrDEHgwytg4L7vuXVpfYwzYaRzHgHUqV2ZUs938FRznGkodzSKFbq2dTeWsQzdbCK4oxSGNNCAGFyniSLPzdCoh7V7AkQqrigHESJChds7M2KwyXwhziF8FAPBTY"
                            width="120" height="120" border="0" alt="Verifica tu correo electrónico" class="CToWUd">
                        </td>
                      </tr>
                      <tr>
                        <td height="30" style="font-size:15px;line-height:15px">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

        </td>
      </tr>

      <tr>
        <td align="center" style="padding:0px 10px 0px 10px">

          <table border="0" cellpadding="0" cellspacing="0" width="100%"
            style="max-width:600px;background-color:#ffffff;border-left:solid 1px #e0e3eb;border-right:solid 1px #e0e3eb;border-bottom:solid 1px #e0e3eb;border-radius:0px 0px 5px 5px;overflow:hidden;width:100%">
            <tbody>
              <tr>
                <td align="left" valign="top" style="text-align:left">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tbody>
                      <tr>
                        <td valign="top" align="center" style="text-align:center;padding:0px 40px">
                          <h1
                            style="margin:0px 0px 15px 0px;font-family:Helvetica,Arial,sans-serif;font-size:36px;line-height:48px;color:#2d0003;font-weight:normal">

                            Verifica tu correo electrónico
                          </h1>
                          <p
                            style="margin:0px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#414141">
                            Queremos asegurarnos de que tenemos la dirección de correo correcta.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td height="30" style="font-size:30px;line-height:30px">&nbsp;</td>
                      </tr>
                      <tr>
                        <td valign="top" align="center" style="text-align:center;padding:0px 40px">
                          <table border="0" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                              <tr>
                                <td align="center" bgcolor="#AF262F" style="border-radius:50px">
                                  <a href="${urlActivacion}"
                                    style="font-size:16px;font-family:Helvetica,Arial,sans-serif;color:#ffffff;text-decoration:none;padding:15px 40px;border-radius:50px;border:1px solid #af262f;display:inline-block;background-color:#af262f"
                                    target="_blank"><strong>
                                      Verificar correo electrónico</strong>
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td height="40" style="font-size:30px;line-height:30px">&nbsp;</td>
                      </tr>
                      <tr>
                        <td valign="top" align="center" style="text-align:center;padding:0px 40px">
                          <p
                            style="margin:0px 0px 20px 0px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#414141">
                            <strong>
                              Tu contraseña</strong>
                          </p>
                          <h3
                            style="margin:0px 0px 30px 0px;font-family:Helvetica,Arial,sans-serif;font-size:32px;line-height:44px;color:#2d0003;font-weight:normal">
                            <span style="padding:10px;border-bottom:1px dashed #c5c5c5">${clave}</span>
                          </h3>
                          <p
                            style="margin:0px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#414141">

                            Por motivos de seguridad, te recomendamos que cambies tu contraseña.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td height="40" style="font-size:30px;line-height:30px">&nbsp;</td>
                      </tr>
                      <tr>
                        <td valign="top" align="center" style="text-align:center;padding:0px 40px">
                          <p
                            style="margin:0px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#414141">

                            Al verificar tu dirección de correo electrónico, confirmas tu registro y que eres
                            mayor de 18 años (21 en el caso de Estados Unidos). Utilizaremos esta dirección de
                            correo para mantenerte al tanto de actualizaciones del producto, información
                            importante acerca de tu cuenta, novedades, y ofertas especiales.

                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td height="40" style="font-size:30px;line-height:30px">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

        </td>
      </tr>

    </tbody>
  </table>


</div>
	
	
	`;
}

module.exports = {
  enviarEmail,
  getPlantilla
}