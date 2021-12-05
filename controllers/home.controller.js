const Doctors = require("../schemas/doctors.schema");
const Users = require("../schemas/registration.schema");
const { verifyHash } = require("../utils/cipher.util");
const Appointments = require("../schemas/appointments.schema");
const Consultations = require("../schemas/consultation.schema");
const GetHospitals = require("../schemas/relationships/doctor_belongs_to_many_hospitals");
const Hospitals = require("../schemas/hospitals.schema");
const Department = require("../schemas/departments.schema");
const firebaseController = require("./firestore.controller");
const { db } = require("../config/firebase.config");
const { signRefreshToken } = require("../middlewares/auth.middleware");
const Patient = require("../schemas/patient.schema");
const { sendEmail } = require("../helpers/mail.helper");
const requestSchema = require("../schemas/request.schema");
const hospitalsSchema = require("../schemas/hospitals.schema");
const loginSchema = require("../schemas/login.schema");


class HomeController {
    async getAllDoctors(req, res){
        try {
         const Doctor =   await Doctors.find()
          let col =   await db.collection('Doctors').get()
       col =  col.docs.map((data)=> data.data())
            res.status(200).json({status:200, message:[Doctor, col]})

        } catch (error) {
            res.status(500).json({ status: 500, message: error.message });
        }
    }
}

module.exports = new HomeController()
