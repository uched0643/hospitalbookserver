const { Schema, model } = require('mongoose')

const Reminders = new Schema({
    user_id: String,

    reminderType: {
        type: String, //can either be for consultation or appointment
        required: [true, 'This field is required'],
    },

    dateStr: {
        type: String,
        required: [true, 'This field is required'],
    },

    external_id: {
        type: Array,
        required: [true, 'This field is required']
    },
    userRole:String //should be either patient doctor or admin

    // doctor has profile image which he/she can store in firebase.
}, {
    timestamps: true
})



module.exports = model('Reminders', Reminders)
