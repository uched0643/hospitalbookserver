const { Schema, model } = require('mongoose')

const Events = new Schema({
    user_id: String,

    eventTitle:{
        type: String,
        required: [true, 'This field is required'],
    },
    eventDescription:String,
    allDay:{
        type:Boolean,
        default:true
    },
    importance:{
        type: String,
        required: [true, 'This field is required'],
        default:'Not Important'
    },
    start:{
        type: String,
        required: [true, 'This field is required'],
    },
    end:{
        type: String,
        required: [true, 'This field is required'],
    },
    startDate:{
        type: String,
        required: [true, 'This field is required'],
    },
    endDate:{
        type: String,
        required: [true, 'This field is required'],
    },

    // doctor has profile image which he/she can store in firebase.
}, {
    timestamps: true
})



module.exports = model('Events', Events)
