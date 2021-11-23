const {Schema, model} = require('mongoose')

const Consultations = new Schema({
    patient_id:String,
    doctors_id: String,
    consultation_id:String,
    reason:{
        type:String,
        required:[true,'This field is required'],
        min:[3, 'Required 6 but got {VALUE}']
    },
   
    

    /* img, and videos and reason are stored in firebase */ 
}, {
    timestamps: true
})

module.exports = model('Consultations', Consultations)