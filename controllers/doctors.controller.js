const Doctors = require('../schemas/doctors.schema')
const Users = require('../schemas/registration.schema')
const { verifyHash } = require('../utils/cipher.util')
const Appointments = require('../schemas/appointments.schema');
const Consultations = require('../schemas/consultation.schema');
// const {db} =  require('../config/firebase.config')
const GetHospitals = require('../schemas/relationships/doctor_belongs_to_many_hospitals')
const Hospitals = require('../schemas/hospitals.schema')
const Department = require('../schemas/departments.schema')

class DoctorsPostController {

    async createDOctor(req, res) {
        try {
            const user_email = await Users.find({ email: req.body.email.trim() })
            const user_password = verifyHash(req.body.password, user_email.password)

            if (!user_email && !user_password) return res.status(400).json({ status: 400, message: 'Invalid email or password' })

            const newDoctor = {
                user_id: user_email._id,
                gender: req.body.gender.trim().toLowerCase(),
                date_of_birth: req.body.date_of_birth.trim(),
                specialty: req.body.specialty.trim(),
                address: req.body.address.trim()
            }

            await Doctors.create(newDoctor)
            res.status(200).json({ status: 200, message: 'OK' })

        } catch (error) {
            res.status(500).json({ status: 500, message: error.message })
        }

    }

    async appointment(req, res) {
        try {
            const patient = await Users.find({ email: req.body.patient_email.trim() })
            const doctor = await Users.find({ email: req.body.doctors_email.trim() })

            if (!patient) return res.status(400).json({ status: 400, message: 'Patient Not Found' })
            if (!doctor) return res.status(400).json({ status: 400, message: 'Invalid Credentials' })

            const newAppointment = {
                patient_id: patient._id,
                doctors_id: doctor._id,
                reason: req.body.reason.trim().substring(0, 20),
                dateString: req.body.dateString.trim(),
                status: 'Success'
            }

            const appointment = await Appointments.create(newAppointment)
            // send booth the patient and the doctor confirmation emails
            res.status(200).json({ status: 200, message: 'OK' })

        } catch (error) {
            res.status(500).json({ status: 500, message: error.message })
        }
    }

    async consultation(req, res, next) {
        try {
            const patient = await Users.find({ email: req.body.patient_email.trim() })
            const doctor = await Users.find({ email: req.body.doctors_email.trim() })

            if (!patient) return res.status(400).json({ status: 400, message: 'Patient Not Found' })
            if (!doctor) return res.status(400).json({ status: 400, message: 'Invalid Credentials' })

            const { img, video, reason, disease } = req.body;

            const newConsultation = {
                patient_id: patient._id,
                doctors_id: doctor._id,
                reason: reason.substring(0, 20),
                consultation_id: Date.now()

            }

           await Consultations.create(newConsultation)
            // store img, video, consultation_id, _id to firebase
            
            res.status(200).json({ status: 200, message: 'OK' })

        } catch (error) {
            res.status(500).json({ status: 500, message: error.message })

        }
    }

    async createFolder(req, res, next){
        try {
            const {name} = await req.body


        } catch (error) {
            
        }
    }

}

class DoctorsGetController {

    async getAllDoctor(req, res) {
        try {
            const doctors = await Doctors.findAll()

            res.status(200).json({ status: 200, message: doctors })

        } catch (error) {
            res.status(500).json({ status: 500, message: error.message })

        }
    }

    async getDoctorsHospitals(req, res, next) {
        try {
            const getDoctorsHospitals = await GetHospitals.find({ doctor_id: req.params.id })
            const hospitals = await Hospitals.findAll({ _id: getDoctorsHospitals.hospital_id })
            const department = await Department.find({ doctor_id: getDoctorsHospitals.doctor_id })

            res.status(200).json({ status: 200, data: [hospitals, department] })


        } catch (error) {
            res.status(500).json({ status: 500, message: error.message })

        }

    }



}

class DoctorsPutController {
    async updateProfile(req, res) {
        try {
            const doctor = await Doctors.findById(req.params.id)
            const { img, about, specialty, department, name, gender } = req.body;
            
            const updateProfile = {
                gender:gender,
                department:department,
                name:name,
                specialty:specialty,
            }
            
            await Doctors.findOneAndUpdate(req.params.id, {$set:updateProfile})
            // update doctors img and desc in firebase.

        } catch (error) {
            res.status(500).json({ status: 500, message: error.message })
    
        }
    }

    async editAppointment(req, res) {
        try {
            const appointment = await Appointments.findById(req.params.id)
            if (!appointment) return res.status(400).json({ status: 400, message: 'Appointment expired' })
          
            const {reason, dateString} = req.body

            await Appointments.findByIdAndUpdate(req.params.id, {$set:{reason:reason, dateString:dateString}})

            res.status(200).json({ status: 200, message: 'OK' })
            
        } catch (error) {

            res.status(500).json({ status: 500, message: error.message })
            
        }
    
    }

    async editConsultation(req, res){
        try {
          
            const { img, video, reason, disease } = req.body;
            
            const newConsultation = {
                reason: reason.substring(0, 20),
                consultation_id: Date.now()
                
            } 
            const consultation = await Consultations.findByIdAndUpdate(req.params.id, {$set:{reason:reason}})

            // store img, video, consultation_id, _id to firebase
         
        } catch (error) {
            
        }
    }

}

class DoctorsDeleteController {
    async deletePastAppointments(req, res, next) {
        try {
            await Appointments.findByIdAndDelete(req.params.id)
            // const appointment_id = await Appointments.deleteOne({ _id: req.params.id })
            res.status(200).json({ status: 200, message: 'OK' })

        } catch (error) {
            res.status(500).json({ status: 500, message: error.message })
        }
    }

    async deletePastConsultations(req, res, next){
        try {
            await Consultations.findByIdAndDelete(req.params.id)
            res.status(200).json({ status: 200, message: 'OK' })
        } catch (error) {
            res.status(500).json({ status: 500, message: error.message })
        }
    }

    async deleteFolder(req, res, next){
        try {
            
        } catch (error) {
            
        }
    } 

    async deleteFiles(req, res, next){
        try {
            
        } catch (error) {
            
        }
    }

}


module.exports = {
    PostController:new DoctorsPostController(),
    GetController: new DoctorsGetController(),
    PutController: new DoctorsPutController(),
    DeleteController: new DoctorsDeleteController()
}
