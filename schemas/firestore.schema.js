
const { db } = require('../config/firebase.config')

class Firestore {

    async cloudCollection(userCollection, collectionName, userDocumentName, documentName, data = {}){
        try {
            await db.collection(userCollection).doc(userDocumentName).collection(collectionName).doc(documentName).set(data)
            return true
        } catch (error) {
            throw new Error(error.message)            
        }
    }

    async getCollectionQueryData(userCollection, userDocumentName){
        try {
           const collectionData = await db.collection(userCollection).doc(userDocumentName).listCollections()
           return collectionData
        } catch (error) {
            throw new Error(error.message)
        }
    }

}