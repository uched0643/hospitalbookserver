const { Schema, model, Types } = require('mongoose')

const Departments = new Schema({

    doctor_id: {
        type: Schema.Types.ObjectId,
        ref: "Doctors",
    },

    hospital_id: {
        type: Schema.Types.ObjectId,
        ref: "Hospitals"
    },

    // doctor has profile image which he/she can store in firebase.
}, {
    timestamps: true
})



module.exports = model('Departments', Departments)
