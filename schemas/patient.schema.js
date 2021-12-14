const { Schema, model } = require('mongoose')

const Patients = new Schema({
    user_id: String,

    gender: {
        type: String,
        required: [true, 'This field is required'],
    },

    date_of_birth: {
        type: String,
        required: [true, 'This field is required'],
    },
    occupation :{
        type: String,
        required: [true, 'This field is required'],
    },
    address: {
        type: Array,
        required: [true, 'This field is required']
    }

    // doctor has profile image which he/she can store in firebase.
}, {
    timestamps: true
})



module.exports = model('Patients', Patients)
