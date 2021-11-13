const { createTransport,  } =  require('nodemailer')
require('dotenv').config()

const transport = createTransport({
    service:'gmail',
    auth:{
        user:process.env.MAIL_USERNAME,
        pass:process.env.MAIL_PASS,
  
    }
})

const sendMail = async(user, user_id) => {
    try {
     await transport.sendMail({
            from:process.env.MAIL_USERNAME,
            to:user,
            subject:' Account Activation',
            text:`Please Activate your Account`,
            html:`
            <p> 
            ${user} please Click on the button to Activate Your Account
            </p>
            <a href='http://${process.env.HOST}:${process.env.port}/activate/:${user_id}'>
             Activate 
            </a>
            `
        })
        
        console.log('success');
        
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { sendMail }