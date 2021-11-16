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
            <form method="POST" action="https://hospital-book-server.cleverapps.io/activate/:${user_id}">
                <button type="submit">Activate</button>
            </form>
           
            `
        })
        
        console.log('success');
        
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { sendMail }