const {Schema, model} = require('mongoose')

const Admins = new Schema({
    first_name:{
        type:String,
        required:[true,'This field is required'],
        min:[3, 'Required 6 but got {VALUE}']
    },
    last_name:{
        type:String,
        required:[true,'This field is required'],
        min:[3, 'Required 6 but got {VALUE}']
    },
    email:{
        type:String,
        required:[true, 'This field is required']
    },
    phone_number:{
        type:String,
        required:[true, 'This field is required']
    },
    date_of_birth:{
        type:String,
        required:[true, 'This field is required']
    },
    gender:{
        type:String,
        required:[true, 'This field is required']
    },
    address:{
        type:String,
        required:[true, 'This field is required']
    }

}, {
    timestamps: true
})

module.exports = model('Admins', Admins)
