const Users = require('../schemas/registration.schema')
const {hashPassword, verifyHash} = require('../utils/cipher.util')
const { sendMail } = require('../helpers/mail.helper')
const { signAccessToken, signRefreshToken } = require('../middlewares/auth.middleware')
const Login = require('../schemas/login.schema')
class AuthController{
    async Register(req, res, next){
        try {
            const user= await Users.findOne({
                email:req.body.email,
                phone_number:req.body.phone_number
            });
            if(user) return res.status(400).json({message:'User already exist'})

            const {first_name, 
                last_name, 
                email, 
                tel, 
                password} = req.body

            const newUser = {
                first_name:first_name.charAt(0).toUpperCase()+first_name.substring(1, ),
                last_name:last_name.charAt(0).toUpperCase()+last_name.substring(1, ),
                email:email.trim().toLowerCase(),
                password:hashPassword(password),
                tel:tel.trim()
            }

            const createUser= await Users.create(newUser)
            await sendMail( newUser.email, createUser._id)
            // const token = signAccessToken(createUser._id)

            res.status(200).redirect('https://hospitalbookapp.web.app/activate-account')

        } catch (error) {
    
            res.status(500).json({status:500, message:error.message})
    
        }
    }

    async login(req, res){
        try {
            const user_email = await Users.find({
                email:req.body.email.trim(),
            })
            const password = verifyHash(req.body.password, user_email.password)
            
            const isLogged = await Login.find({ email:req.body.email.trim()})

            if(!isLogged){
                return res.status(400).json({status:400, error_message:'Please Create An Account'});
            }

            if (!user_email && !password) return res.status(400).json({status:400, error_message:'Invalid username or password', message:req.body.email});
            
            const {user_agent} = isLogged;
            
            if(user_agent != req.headers['user-agent']){

                await sendMail(user_email.email, user_email._id )
                res.status(200).json({message:`Logged in recently on ${req.headers['user-agent']} at ${new Date()}`})
            
            }

            const login = {
                user_id:user_email.id,   
                email:user_email.email,
                user_agent: req.headers['user-agent'], 
            }
            
            await Login.create(login)
            const token = signRefreshToken(login.user_id)

            res.status(200).json({status:200, message:login, token:token})

        } catch (error) {

            res.status(500).json({status:500, message:error.message})
        
        }
    }
}


module.exports = new AuthController()
