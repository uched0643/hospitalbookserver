const {Schema, model} = require('mongoose')

const Token = new Schema({
    user_id:String,
    token:String,
    exp:String,
    user_client:String
}, {
    timestamps: true
})

module.exports = model('UserToken', Token)