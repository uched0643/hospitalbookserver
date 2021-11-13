const {verify, sign} = require('jsonwebtoken')
const {resolve} =  require('path')
const {readFileSync} = require('fs')
const Token =  require('../schemas/token.schema')

const PRIVATE_KEY = readFileSync(resolve(__dirname,'./../environment/priv.pem'), 'utf8' );
const PUBLIC_KEY = readFileSync(resolve(__dirname,'./../environment/pub.pem'), 'utf8' );

const signToken = async (_id, exp) =>  {
    try {
        const payload = {
            sub: _id,
            iat: Date.now()
        }
        const signedToken =sign(payload, PRIVATE_KEY, { expiresIn: exp, algorithm: 'RS256' })
        return {
            token: "Bearer " + signedToken,
            expiresIn: exp,
            iat:Date.now()
        }

    } catch (error) {
        return false;
    }
}

const signAccessToken = (_id) => signToken(_id, 3600)
const signRefreshToken = (_id) => signToken(_id, 300)

const authenticateToken = async(req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
        if(!token) return res.status(401).json({status:401, message:'invalid request'})
    
        verify(token, PUBLIC_KEY, {algorithms:"RS256", ignoreExpiration:false }, (err, user) => {
            if(err) return res.status(401).json({status: 401, message:err})
            
            const { sub } = user
            if(!sub) return res.status(500).json({status:500, message:'request header data could not be found'})
            // next()
            const expires = timer(user.exp)
            if(expires) return res.redirect('/login')
            
        })
        
    } catch (error) {
        res.status(500).json({status:500, message:error.message})   
    }

}


const timer = (iat) => {
    const now = new Date()
    const issue_at = new Date(iat);
    ( (now.getHours() - issue_at.getHours()) != 0 || (now.getMinutes() - issue_at.getMinutes()) > 6)?true:false
}




module.exports = {signAccessToken, signRefreshToken, authenticateToken, timer}
