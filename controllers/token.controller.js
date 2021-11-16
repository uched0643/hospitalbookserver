const { signAccessToken, signRefreshToken, timer, authenticateToken } = require('../middlewares/auth.middleware')
const Users = require('../schemas/registration.schema')
const Token = require('../schemas/token.schema')
const   mongoose = require('mongoose')

class TokenController {
    
    async signToken(req, res, next) {
    
        try {

            let _id = mongoose.Types.ObjectId
            _id = new _id(req.params.id.trim())
            const user =  await Token.findById(_id)
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
            
            res.status(200).redirect('https://hospitalbookapp.web.app/auth')

            }
            
            const _user = await Users.findByIdAndUpdate(req.params.id, { $set: { active: true } })
            const userAccessToken = await signAccessToken(req.params.id)
            
            const userAgent = req.headers['user-agent']; 
            
            const userClient = {
                user_id:req.params.id,
                token:userAccessToken.token,
                exp:userAccessToken.expiresIn,
                user_agent:userAgent
            }

            await Token.create(userClient)

            res.status(200).json({ status: 200, token: userAccessToken, message: { active: true, user_client:userClient.user_agent } })

        } catch (error) {

            res.status(500).json({status:500, message:error.message})

        }
    }


   

}

module.exports = new TokenController()
