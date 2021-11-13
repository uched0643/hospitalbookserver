const {Schema, model} = require('mongoose')

const Login = new Schema({
    user_id:String,   
    email:String,
    user_agent:String
}, {
    timestamps: true
})

module.exports = model('Login', Login)
