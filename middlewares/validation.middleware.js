
const { check } = require('express-validator')

const registrationValidator = [
    check("first_name", "First Name is not correct").trim().isLength({ min: 3, max: 20 }).custom(value => /^[a-zA-Z]{3,}$/i.test(value)).bail(),
    check("last_name", "Last Name is not Correct").trim().isLength({ min: 3, max: 20 }).custom(value => /^[a-zA-Z]{3,}$/i.test(value)).bail(),
    check("email", 'Invalid Email').trim().isEmail().bail(),
    check("password", 'Password must contain at least mixed case letter. a special character and atleast a number and it must be atleast 8 and maximum 20').isLength({
        min: 8, max: 20
    }).custom((value) => /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*\-_]).{8,}$/.test(value)).bail(),
    check("confirm_password", 'Please Re-enter Your Password').custom((value, { req }) => {
        return value === req.body.password
    }),
    check('tel').trim().custom(value => /(\+237)\s?(6|2)(2|3|[5-9])[0-9]{7}/.test(value))
]


const loginValidator = [
   
    check("email", 'Invalid Email').trim().isEmail().bail(),
    check("password", 'Password must contain at least mixed case letter. a special character and atleast a number and it must be atleast 8 and maximum 20').isLength({
        min: 8, max: 20
    }).custom((value) => /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*\-_]).{8,}$/.test(value)).bail(),
   
]


const doctorValidator = [
    check('gender'), check('dateOfBirth'), check('department'), check('speciality'), check('experience')

]

module.exports = { registrationValidator , loginValidator}