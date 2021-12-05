const { signAccessToken, signRefreshToken, timer, authenticateToken } = require('../middlewares/auth.middleware')
const Users = require('../schemas/registration.schema')
const Token = require('../schemas/token.schema')
const   mongoose = require('mongoose')
require('dotenv').config()
const URL = process.env.FRONTENDDEVURL||process.env.FRONTENDPRODURL || `https://hospitalbookapp.web.app/`

class TokenController {
    
    async signToken(req, res, next) {
    
        try {
            
            let {id} = req.params
            id = new mongoose.Types.ObjectId(id)
            
            const user =  await Token.findById(id)
            if(user){
            const userRefreshToken = await signRefreshToken(req.params.id)
            const userAgent = req.headers['user-agent']; 
            const token = {
                user_id:user._id,
                token:userRefreshToken.token,
                exp:userRefreshToken.expiresIn,
                user_agent:userAgent
            }
            
            await Token.findByIdAndUpdate(user._id, {$set:token})
            
            res.status(200).redirect(`${URL}auth`)
            
            }else{

                await Users.findByIdAndUpdate(req.params.id, { $set: { active: true } })
                const userAccessToken = await signAccessToken(req.params.id)
                
                const userAgent = req.headers['user-agent']; 
                
                const userClient = {
                        user_id:req.params.id,
                        token:userAccessToken.token,
                        exp:userAccessToken.expiresIn,
                        user_agent:userAgent
                    }
                    
                    await Token.create(userClient)
                    
                    // res.status(200).json({ status: 200, token: userAccessToken, message: { active: true, user_client:userClient.user_agent } })
                    res.status(200).redirect(`${URL}auth`)
            }
            
        } catch (error) {

            res.status(500).json({status:500, message:error.message})

        }
    }


   

}

module.exports = new TokenController()
