
const { db } = require('../config/firebase.config')

class NodeFirestore{
    

    constructor(collectionName) {
        this.collection = db.collection(collectionName)
    }
    
     addToFirestore(data) {
         return new Promise(async (resolve, reject) => {
          
                 const record = this.collection.add(data)
                 record.then((result) => {
                     resolve(result)
                 }).catch((err) => {
                     reject(err)
                 });
          
        })
     }
    
    

}