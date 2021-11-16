const { Schema, model } = require('mongoose')

const Appointments = new Schema({
    patient_id: {
        type: String,
        required: [true, 'This field is required']
    },
    doctors_id: {
        type: String,
        required: [true, 'This field is required']
    },
    reason: {
        type: String,
        required: [true, 'This field is required']
    },
    dateString: {
        type: String,
        required: [true, 'This field is required']
    },
    status: {
        type: String, //patient status [severe, minor case]
        required: [true, 'This field is required']
    },
    

}, {
    timestamps: true
})

module.exports = model('Appointments', Appointments)
