const { Schema, model } = require('mongoose')

const Request = new Schema({
    user_ids: Array,
    from:String,
    to:String,
    subject:String,
    status:String,


    // doctor has profile image which he/she can store in firebase.
}, {
    timestamps: true
})



module.exports = model('Request', Request)
