const route = require('express').Router();
const {registrationValidator, loginValidator, doctorValidator} = require('../middlewares/validation.middleware')
const AuthController =  require('../controllers/auth.controller')
const { authenticateToken } = require('../middlewares/auth.middleware')
const TokenController = require('../controllers/token.controller')
const { PostController, PutController, GetController, DeleteController } =  require('../controllers/doctors.controller')
const { PatientGetController, PatientPostController, PatientPutController, PatientDeleteController } = require('../controllers/patient.controller')
const HomeController = require('../controllers/home.controller')
// get routes
route.get('/', (req, res)=>{
    res.status(200).json({message:'welcome', status:200})
})

// post routes

// users post routes
route.post('/register', [registrationValidator], AuthController.Register)
route.post('/login', [loginValidator], AuthController.login)
route.get('/activate/:id', TokenController.signToken)

// DOCTORS ROUTES
// POST
route.post('/doctors/register',[authenticateToken],  PostController.createDOctor)
route.post('/doctors/appointments', [authenticateToken], PostController.appointment)
route.post('/doctors/consultation', [authenticateToken], PostController.consultation)
route.post('/doctors/create-folder', [authenticateToken], PostController.createFolder)
route.post('/doctor/request/:id', [authenticateToken], PostController.requestTpHospital)
route.post('/doctor/login', [authenticateToken], PostController.login)

// PUT 
route.put('/doctors/edit-appointment/:id', [authenticateToken], PutController.editAppointment)
route.put('/doctor/consultations/:id', [authenticateToken], PutController.editConsultation)
route.put('/doctors/register', [authenticateToken], PutController.updateProfile)

// DELETE
route.delete('/doctors/deleteAppointments/:id', [authenticateToken], DeleteController.deletePastAppointments)
route.delete('/doctors/deleteConsultations/:id', [authenticateToken], DeleteController.deletePastConsultations)
route.delete('/delete/folder/:id', [authenticateToken], DeleteController.deleteFolder)

// GET
route.get('/doctors-info', [authenticateToken], GetController.getDoctor)
route.get('/doctors/folder', [authenticateToken], GetController.getFolders)


// PATIENT ROUTES
// POST
route.post('patient/register', [authenticateToken], PatientPostController.createPatient)
route.post('patient/login', PatientPostController.login)
route.post('patient/appointments/:id', [authenticateToken], PatientPostController.patientAppointmentRequest)
route.post('patient/consultation', [authenticateToken], PatientPostController.patientConsultationRequest)

// GET
route.get('/patient',[authenticateToken], PatientGetController.getpatientData)
route.get('patient/appointments', [authenticateToken], PatientGetController.getPatientsAppointments)
route.get('/consultations',[authenticateToken], PatientGetController.getPatientsConsultaions)
route.get('patient/events', [authenticateToken], PatientGetController.getPatientsEvents)

// PUT
route.put('/appointments/:id', [authenticateToken], PatientPutController.updateAppointment)
route.put('/consultations/appointments/:id', [authenticateToken], PatientPutController.updateConsultaion)
route.put('/events/:id', [authenticateToken], PatientPutController.updateEvent)
route.put('/patient/:id', [authenticateToken], PatientPutController.updateProfile)

// DELETE
route.delete('/request/:id', [authenticateToken], PatientDeleteController.deleteRequest)
route.delete('/event/:id', [authenticateToken], PatientDeleteController.deleteEvent)


route.get('/all-doctor', HomeController.getAllDoctors)


// PATIENTS

module.exports = {route}
