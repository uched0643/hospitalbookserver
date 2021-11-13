const {resolve} = require('path')
const firebase = require('firebase-admin')

const serviceAccount = require('../environment/hospitalbook-3f218-firebase-adminsdk-8ge83-58b9fe7049.json')

firebase.initializeApp({
    credential:firebase.credential.cert(serviceAccount)
})

const db = firebase.firestore()

module.exports = {db}

