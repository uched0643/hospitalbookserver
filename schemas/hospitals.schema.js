const {Schema, model} = require('mongoose')

const Hospitals = new Schema({
    creator_id: String,
    
    name:{
        type: String,
        required: [true, 'This field is required'],

    },

    address:{
        type: String,
        required: [true, 'This field is required'],
        
    },
    email:{
        type: String,
        required: [true, 'This field is required']
        
    },

   

    /* 
    hospital has profile and description
    image which he/she can store in firebase.
    */
}, {
    timestamps: true
})




module.exports = model('Hospitals', Hospitals)
