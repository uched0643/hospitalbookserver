
class AdminPostController {
    async createHospital(req, res){
        try {
            const { email, password, hospital_name, hospital_emergency_contact } = req.body

            



        } catch (error) {
            res.status(500).json({status:500, message:error.message })
        }
    
    }
}