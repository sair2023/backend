'use strict'
const nodemailer = require('nodemailer');

const mail = {
    user: 'sair.ayestas@gmail.com',
    pass: 'nomh onrf heba ktva'
}

const transporter = nodemailer.createTransport({
    service: "gamil",
    host: "smtp.gmail.com",
    port: 587,
    tls:  {
        rejectUnauthorized: false
    },
    secure: false,
    auth: {
      user: 'sair.ayestas@gmail.com',
      pass: 'nomh onrf heba ktva'
    }
  });
  

 const sendEmail = async (correo, subject, html)=> {

    try {
        await transporter.sendMail({
            from: ["sair.ayestas@gmail.com"], // sender address
            to: correo, // list of receivers
            subject, // Subject line
            text: "Hello world?", // plain text body
            html, // html body
          });
    } catch (error) {
        console.log('Algo no va bien con el correo electronico',error)
    }
      
}

const getTemplete = (nombre, token)=>{
    return  `
    <style type="text/css">
    img {
        max-width: 600px;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
  
      a img {
        border: none;
      }
  
      table {
        border-collapse: collapse !important;
      }
  
      #outlook a {
        padding: 0;
      }
  
      .ReadMsgBody {
        width: 100%;
      }
  
      .ExternalClass {
        width: 100%;
      }
  
      .backgroundTable {
        margin: 0 auto;
        padding: 0;
        width: 100%;
      }
  
      table td {
        border-collapse: collapse;
      }
  
      .ExternalClass * {
        line-height: 115%;
      }
  
      /* General styling */
      td {
        font-family: Open Sans, Roboto, Helvetica Neue, Arial, sans-serif;
        color: #6f6f6f;
      }
  
      body {
        -webkit-font-smoothing: antialiased;
        -webkit-text-size-adjust: none;
        width: 100%;
        height: 100%;
        color: #6f6f6f;
        font-weight: 400;
        font-size: 18px;
        overflow-x: hidden;
      }
  
      h1 {
        margin: 10px 0;
      }
  
      a {
        text-decoration: none;
      }
  
      .force-full-width {
        width: 100% !important;
      }
  
      .force-width-80 {
        width: 80% !important;
      }
  
      .body-padding {
        padding: 0 75px;
      }
  
      .mobile-align {
        text-align: right;
      }
  
      @media screen {
  
        /*@import url(https://fonts.googleapis.com/css?family=Roboto);
          {
          font-family: 'Open Sans', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
        }
  
        .w280 {
          width: 280px !important;
        }
      }
  
      /* Mobile styles */
      @media only screen and (max-width: 480px) {
        table[class*="w320"] {
          width: 320px !important;
        }
  
        td[class*="w320"] {
          width: 280px !important;
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
  
        img[class*="w320"] {
          width: 111px !important;
        }
  
        td[class*="mobile-spacing"] {
          padding-top: 0px !important;
          padding-bottom: 0px !important;
          padding-left: 30px !important;
          padding-right: 30px !important;
        }
  
        *[class*="mobile-hide"] {
          display: none !important;
        }
  
        *[class*="mobile-br"] {
          font-size: 12px !important;
        }
  
        td[class*="mobile-w20"] {
          width: 20px !important;
        }
  
        img[class*="mobile-w20"] {
          width: 20px !important;
        }
  
        td[class*="mobile-center"] {
          text-align: center !important;
        }
  
        table[class*="w100p"] {
          width: 100% !important;
        }
  
        td[class*="activate-now"] {
          padding-right: 0 !important;
          padding-top: 20px !important;
        }
  
        td[class*="mobile-block"] {
          display: block !important;
        }
  
        td[class*="mobile-align"] {
          text-align: left !important;
        }
      }
   </style>
   <body class="body" style="padding:0; margin:0; display:block; background:#1B1B1B; -webkit-text-size-adjust:none;" bgcolor="#eeebeb">
  <table align="center" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" valign="top" style="background-color:#1B1B1B" width="100%">

        <center>

          <table cellspacing="0" cellpadding="0" width="600" class="w320">
            <tr>
              <td align="center" valign="top">

                <table style="margin:0 auto;" cellspacing="0" cellpadding="30px" width="100%">
                  <tr>
                    <td style="text-align: center;">
                    <br>
                  </tr>
                </table>

                <table cellspacing="0" cellpadding="0" class="force-full-width" style="background-color: #3bcdb0;">
                  <tr>
                    <td style="background-color: #FFFFFF;">

                      <table cellspacing="0" cellpadding="0" width="100%">
                        <tr>
                          <td>
                            
                            <img src="https://i.imgur.com/84wqBi7.png" style="max-width:140px; display:block; margin:auto; padding-top:60px; padding-bottom:10px; ">
                          </td>
                        </tr>
                      </table>

                      <table cellspacing="0" cellpadding="0" class="force-full-width">
                        <tr>
                          <td style="font-size:36px; font-weight: 600; letter-spacing: -1px; color: #000000; text-align:center; opacity: 0.75; padding-top: 20px " class="mobile-spacing">
                        
                            Email de Confirmación
                            <br />
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size:16px; font-weight: 400; text-align:center; padding: 0 75px; color: black" class="w320 mobile-spacing">

                            <p style="opacity: 0.7;">Hola <b> ${nombre} </b>, para completar tu registro
                              haz clic en el botón <b>Confirmar Cuenta</b> que
                              aparece a continuación</p>
                          </td>
                        </tr>
                                 <tr>
                    <td style="background-color:#ffffff; padding-top: 0px;">

                      <table style="margin:0 auto;" cellspacing="0" cellpadding="20px" width="100%">
                        <tr>
                          <td style="text-align:center; margin:0 auto;">
                            <br>
                            <div>
                              <a class="verificar-email w280" href="http://localhost:4201/api/confirmacion/${token}"  target="_blank" style="background-color:#80CC28;color:#ffffff;display:inline-block;font-family:'Open Sans', Roboto, Helvetica Neue, sans-serif;font-size:16px;font-weight: bold;line-height:50px;text-align:center;text-decoration:none;border-radius:40px;box-shadow: 0 5px 10px 0 rgba(27,27,27,100);-webkit-text-size-adjust:none; min-width:200px;">Confirmar Cuenta</a>
                
                            </div>
                            <br>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>
                 
                    </td>
                  </tr>
                </table>

                <table cellspacing="0" cellpadding="0px" bgcolor="#1B1B1B" class="force-full-width">
                <tr>
                  <td style="color: black; background-color: #1B1B1B; font-size: 14px; text-align:left; padding-left: 20px; ">
                    <a style="opacity: 0.75 ; color: white;"> Enviado por el equipo de T Consulting S.A.
                  </td>

                  <td>
                    <br>
                  </td>
                </tr>
              </table>
              </td>
            </tr>
          </table>

        </center>

      </td>
    </tr>
  </table>
</body>

`;
}

module.exports = {
sendEmail,
getTemplete
}
