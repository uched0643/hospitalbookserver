const { Schema, model } = require('mongoose')

const Events = new Schema({
    user_id: String,

    eventTitle:{
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
