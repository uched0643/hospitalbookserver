const {resolve} = require('path')
const firebase = require('firebase-admin')

const serviceAccount = require('../environment/recordhospitalapp-firebase-adminsdk-a254o-2fb8b22c7e.json')

firebase.initializeApp({
    credential:firebase.credential.cert(serviceAccount)
})

const db = firebase.firestore()

module.exports = {db}

