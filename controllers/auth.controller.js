const Users = require('../schemas/registration.schema')
const { hashPassword, verifyHash } = require('../utils/cipher.util')
const { sendMail, sendEmail } = require('../helpers/mail.helper')
const { signAccessToken, signRefreshToken } = require('../middlewares/auth.middleware')
const Login = require('../schemas/login.schema')


class AuthController {
    async Register(req, res, next) {
        try {
            const { first_name,
                last_name,
                email,
                tel,
                password } = req.body

            const user = await Users.findOne({
                email: email.trim(),
                tel: tel.trim()
            });
            if (user) return res.status(400).json({ status:400, message: 'User already exist' })

            const newUser = {
                first_name: first_name.charAt(0).toUpperCase() + first_name.substring(1,),
                last_name: last_name.charAt(0).toUpperCase() + last_name.substring(1,),
                email: email.trim().toLowerCase(),
                password: hashPassword(password),
                tel: tel.trim(),
                active:false
            }

            const createUser = await Users.create(newUser)
            await sendMail(newUser.email, createUser._id)
            await sendEmail(newUser.email, `Account Activation`, `
            
            `)
            // const token = signAccessToken(createUser._id)

            // res.status(200).redirect('https://hospitalbookapp.web.app/activate-account')
            res.status(200).json({status:200, message:'Ok'})
        } catch (error) {

            res.status(500).json({ status: 500, message: error.message })

        }
    }

    async login(req, res) {
        try {

            const { email, password } = req.body
            const user= await Users.findOne({
                email: email.trim(),
            })
            const hashPassword = verifyHash(password, user.password)

            
            const isLogged = await Login.find({ email: email.trim() })
            if(!user.active)return res.status(400).json({ status: 400, message: 'Please Activate your account' });

            // if (!isLogged) {
            //     return res.status(400).json({ status: 400, error_message: 'Please Create An Account' });
            // }

            if (!user && !hashPassword) return res.status(400).json({ status: 400, error_message: 'Invalid username or password', message: email });

            const { user_agent } = isLogged[isLogged.length-1];
            
             let login = {
                user_id: user._id,
                email: user.email,
                user_agent: req.headers['user-agent'],
            }
            
            await Login.create(login)
            const token = signRefreshToken(login.user_id)

            if (user_agent != req.headers['user-agent']) {

                // senduser mail logged in from new device
                res.status(200).json({ status: 200, message: login, token: token })
            }
            else {              
                res.status(200).json({ status: 200, message: login, token: token })
            }

        } catch (error) {

            res.status(500).json({ status: 500, message: error.message })

        }
    }
}


module.exports = new AuthController()
