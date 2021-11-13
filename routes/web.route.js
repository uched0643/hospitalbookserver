const route = require('express').Router();
const {registrationValidator, loginValidator} = require('../middlewares/validation.middleware')
const AuthController =  require('../controllers/auth.controller')
const { authenticateToken } = require('../middlewares/auth.middleware')
const TokenController = require('../controllers/token.controller')
const { PostController, PutController, GetController, DeleteController } =  require('../controllers/doctors.controller')
// post routes
// users post routes
route.post('/register', [registrationValidator], AuthController.Register)
route.post('/login', [loginValidator, authenticateToken], AuthController.login)
route.post('/activate/:id', TokenController.signToken)

// doctors post routes
route.post('/doctors/register', [authenticateToken], PostController.createDOctor)
route.post('/doctors/appointments', [authenticateToken], PostController.appointment)
route.post('/doctors/consultation', [authenticateToken], PostController.consultation)
route.post('/doctors/create-folder', [authenticateToken], PostController.createFolder)

// put route
route.put('/doctors/edit-appointment/:id', [authenticateToken], PutController.editAppointment)
route.put('/doctors/register/:id', [authenticateToken], PutController.updateProfile)

// delete route
route.delete('/doctors/deleteAppointments/:id', [authenticateToken], DeleteController.deletePastAppointments)
route.delete('/doctors/deleteConsultations/:id', [authenticateToken], DeleteController.deletePastConsultations)
route.delete('/delete/folder/:id', [authenticateToken], DeleteController.deleteFolder)


module.exports = {route}