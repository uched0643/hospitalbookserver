const { Schema, model } = require('mongoose')

const Doctors = new Schema({
    user_id: String,

    gender: {
        type: String,
        required: [true, 'This field is required'],
    },

    date_of_birth: {
        type: String,
        required: [true, 'This field is required'],
    },

    specialty: {
        type: Array,
        required: [true, 'This field is required']
    },

    address: {
        type: Array,
        required: [true, 'This field is required']
    }

    // doctor has profile image which he/she can store in firebase.
}, {
    timestamps: true
})



module.exports = model('Doctors', Doctors)
