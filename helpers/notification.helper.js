const Token = require('../schemas/token.schema')
const {db} = require('../config/firebase.config')
class Notifications {
    async StoreActivities(req, res){
        try {
            const userId = req.params.id
            const findUser = await Token.find({_id:userId})

            
            /*
            await db.collection('Notifications') 
            add notification to firebase.
            */

        } catch (error) {
            res.status(500).json({status:500, message:error.message})
        }
    }

    async RecentActivities(req, res){
        try {
            const userId = req.params.id
            const findUser = await Token.find({_id:userId})
             /*
            await db.collection('Notifications') 
            sendUser activities for under 24 hrs
            */

        } catch (error) {
            res.status(500).json({status:500, message:error.message})
        }
    }
}