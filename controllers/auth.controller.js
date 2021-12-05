const Users = require("../schemas/registration.schema");
const { hashPassword, verifyHash } = require("../utils/cipher.util");
const { sendMail, sendEmail } = require("../helpers/mail.helper");
const {
  signAccessToken,
  signRefreshToken,
} = require("../middlewares/auth.middleware");
const Login = require("../schemas/login.schema");
require("dotenv").config();
const URL =
  process.env.DEVURL ||
  process.env.PRODURL ||
  `https://hospital-book-server.cleverapps.io/`;

class AuthController {
  async Register(req, res) {
    try {
      const { first_name, last_name, email, tel, password } = req.body;

      const user = await Users.findOne({
        email: email.trim(),
        tel: tel.trim(),
      });
      if (user)
        return res
          .status(400)
          .json({ status: 400, message: "User already exist" });

      const newUser = {
        first_name:
          first_name.charAt(0).toUpperCase() + first_name.substring(1),
        last_name: last_name.charAt(0).toUpperCase() + last_name.substring(1),
        email: email.trim().toLowerCase(),
        password: hashPassword(password),
        tel: tel.trim(),
        active: false,
      };

      const createUser = await Users.create(newUser);

      await sendEmail(
        newUser.email,
        `Account Activation`,
        `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
            
            <head>
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <meta property="og:title" content="Verify Your Email">
             
            </head>
            
            <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="width:100% ;-webkit-text-size-adjust:none;margin:0;padding:0;background-color:#FFF;">
              <center>
                <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable" style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FFF;">
                  <tr>
                    <td align="center" valign="top" style="border-collapse:collapse;">
                      <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader" style="background-color:#FAFAFA;">
                        <tr>
                          <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                         
                            <table border="0" cellpadding="10" cellspacing="0" width="100%">
                              <tr>
                                <td valign="top" style="border-collapse:collapse;">
                               
                                </td>
                              </tr>
                            </table>
                         
                          </td>
                        </tr>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateContainer" style="border:1px none #DDDDDD;background-color:#FFFFFF;">
                        <tr>
                          <td align="center" valign="top" style="border-collapse:collapse;">
                         
                            <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateHeader" style="background-color:#FFFFFF;border-bottom:0;">
                              <tr>
                                <td class="headerContent centeredWithBackground" style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;    padding-bottom: 0px; padding-top: 0px;  background: #1D4ED8; overflow: hidden;">
                             
                                  <img width="130" src="../utils/logo.jpeg" style="height: 105px !important;
                                  line-height: 100%;
                                  outline: none;
                                  text-decoration: none;
                                  transform: scale(2);" id="headerImage campaign-icon">
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="top" style="border-collapse:collapse;">
                           
                            <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateBody">
                              <tr>
                                <td valign="top" class="bodyContent" style="border-collapse:collapse;background-color:#FFFFFF;">
                                  
                                  <table border="0" cellpadding="20" cellspacing="0" width="100%" style="padding-bottom:10px;">
                                    <tr>
                                      <td valign="top" style="padding-bottom:1rem;border-collapse:collapse;" class="mainContainer">
                                        <div style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                          <h1 class="h1" style="color:#202020;display:block;font-family:Arial;font-size:24px;font-weight:bold;line-height:100%;margin-top:20px;margin-right:0;margin-bottom:20px;margin-left:0;text-align:center;">Verify Your Email</h1>
            
                                          <p>Please click the button below to verify your email.</p>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="border-collapse:collapse;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="padding-bottom:10px;">
                                          <tbody>
                                            <tr align="center">
                                              <td align="center" valign="middle" style="border-collapse:collapse;">
                                                <a class="buttonText" 
                                                href="${URL}/activate/${createUser._id}"
                                                style="color: #fff;
                                                text-decoration: none;
                                                font-weight: normal;
                                                display: block;
                                                border: none;
                                                padding: 10px 80px;
                                                font-family: Arial;
                                                background: #1D4ED8;
                                                border-radius: 7px;">Verify</a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                 
                                </td>
                              </tr>
                            </table>
                            
                          </td>
                        </tr>
                        <tr>
                          <td align="center" valign="top" style="border-collapse:collapse;">
                         
                            <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection" style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                              <tr>
                                <td valign="top" class="supportContent" style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                 
                                  <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                    <tr>
                                      <td valign="top" width="100%" style="border-collapse:collapse;">
                                        <br>
                                        <div style="text-align: center; color: #000;">
                                          <p>If Clicking Does Not Work, <br> Please Copy The URL Below And Paste On The Browser TAB:&nbsp;
                                            <span style="
                                           
                                            font-weight: normal;
                                            display: block;
                                            color: #1D4ED8;
                                            ">${URL}/${createUser._id}</span>.</p>
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
                        <tr>
                          <td align="center" valign="top" style="border-collapse:collapse;">
                            
                            <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter" style="background-color:#FFFFFF;border-top:0;">
                              <tr>
                                <td valign="top" class="footerContent" style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                                  <div style="text-align:center;color:#757373;font-family:Arial;font-size:11px;line-height:150%;">
                                    <p style="text-align:center;margin:0;margin-top:2px;">Record | Hospital,Douala Bali | Copyright © 2021 | All rights reserved</p>
                                  </div>
                                
                                </td>
                              </tr>
                            </table>
                       
                          </td>
                        </tr>
                      </table>
                      <br>
                    </td>
                  </tr>
                </table>
              </center>
            </body>
            
            </html>
            `
      );

      res.status(200).json({ status: 200, message: newUser });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({
        email: email.trim(),
      });
      const hashPassword = verifyHash(password, user.password);

      if (!user.active)
        return res
          .status(400)
          .json({ status: 400, message: "Please Activate your account" });

      if (!user && !hashPassword)
        return res
          .status(400)
          .json({
            status: 400,
            error_message: "Invalid username or password",
            message: email,
          });

      const isLogged = await Login.find({ email: email.trim() });

      let login = {
        user_id: user._id,
        email: user.email,
        user_agent: req.headers["user-agent"],
      };

      await Login.create(login);
      const token = await signRefreshToken(login.user_id);

      if (
        isLogged[isLogged.length - 1].user_agent != req.headers["user-agent"]
      ) {
        await sendEmail(
          login.email,
          `Login`,
          `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta property="og:title" content="Verify Your Email">
 
</head>

<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="width:100% ;-webkit-text-size-adjust:none;margin:0;padding:0;background-color:#FFF;">
  <center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable" style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FFF;">
      <tr>
        <td align="center" valign="top" style="border-collapse:collapse;">
          <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader" style="background-color:#FAFAFA;">
            <tr>
              <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
             
                <table border="0" cellpadding="10" cellspacing="0" width="100%">
                  <tr>
                    <td valign="top" style="border-collapse:collapse;">
                   
                    </td>
                  </tr>
                </table>
             
              </td>
            </tr>
          </table>
          <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateContainer" style="border:1px none #DDDDDD;background-color:#FFFFFF;">
            <tr>
              <td align="center" valign="top" style="border-collapse:collapse;">
             
                <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateHeader" style="background-color:#FFFFFF;border-bottom:0;">
                  <tr>
                    <td class="headerContent centeredWithBackground" style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;    padding-bottom: 0px; padding-top: 0px;  background: #1D4ED8; overflow: hidden;">
                 
                      <img width="130" src="../utils/logo.jpeg" style="height: 105px !important;
                      line-height: 100%;
                      outline: none;
                      text-decoration: none;
                      transform: scale(2);" id="headerImage campaign-icon">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" style="border-collapse:collapse;">
               
                <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateBody">
                  <tr>
                    <td valign="top" class="bodyContent" style="border-collapse:collapse;background-color:#FFFFFF;">
                      
                      <table border="0" cellpadding="20" cellspacing="0" width="100%" style="padding-bottom:10px;">
                        <tr>
                          <td valign="top" style="padding-bottom:1rem;border-collapse:collapse;" class="mainContainer">
                            <div style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                              <h1 class="h1" style="color:#202020;display:block;font-family:Arial;font-size:24px;font-weight:bold;line-height:100%;margin-top:20px;margin-right:0;margin-bottom:20px;margin-left:0;text-align:center;">Logged With New Client</h1>

                              <p>You Logged In On <br> ${login.user_agent}</p>
                            </div>
                          </td>
                        </tr>
                      
                      </table>
                     
                    </td>
                  </tr>
                </table>
               
              </td>
            </tr>
           
            <tr>
              <td align="center" valign="top" style="border-collapse:collapse;">
              
                <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter" style="background-color:#FFFFFF;border-top:0;">
                  <tr>
                    <td valign="top" class="footerContent" style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                      <div style="text-align:center;color:#757373;font-family:Arial;font-size:11px;line-height:150%;">
                        <p style="text-align:center;margin:0;margin-top:2px;">Record | Hospital,Douala Bali | Copyright © 2021 | All rights reserved</p>
                      </div>
                     
                    </td>
                  </tr>
                </table>
            
              </td>
            </tr>
          </table>
          <br>
        </td>
      </tr>
    </table>
  </center>
</body>

</html>
                `
        );
      }
      res.status(200).json({ status: 200, message: login, token: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

module.exports = new AuthController();
