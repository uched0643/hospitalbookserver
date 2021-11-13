const {Schema, model} = require('mongoose')

const Users = new Schema({
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

    password:{
        type:String,
        required:[true, 'This field is required']
    },
    tel:{
        type:String,
        required:[true, 'This field is required']
    },
    active:{
        type:Boolean, 
        default:false
    }

}, {
    timestamps: true
})

module.exports = model('Users', Users)