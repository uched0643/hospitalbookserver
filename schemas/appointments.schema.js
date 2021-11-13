const { Schema, model } = require('mongoose')

const Appointments = new Schema({
    patient_id: String,
    doctors_id: String,
    reason: {
        type: String,
        required: [true, 'This field is required']
    },
    dateString: String,
    status: String,
    

}, {
    timestamps: true
})

module.exports = model('Appointments', Appointments)
