const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('database connected successfully');
    } catch (error) {
        throw new Error(error.message)
    }
}

connectDB()