
const { db } = require('../config/firebase.config')

class NodeFirestore{
    

    // constructor(collectionName) {
    //     this.collection = db.collection(collectionName)
    // }
    
    //  addToFirestore(data) {
    //      return new Promise(async (resolve, reject) => {
          
    //              const record = this.collection.add(data)
    //              record.then((result) => {
    //                  resolve(result)
    //              }).catch((err) => {
    //                  reject(err)
    //              });
          
    //     })
    //  }
    
    

     newRecord(data, collectionName) {
        return new Promise(async (resolve, reject) => {
         const collectionName = db.collection(collectionName)
                const record = collectionName.add(data)
                record.then((result) => {
                    resolve(result)
                }).catch((err) => {
                    reject(err)
                });
         
       })
    }

    }

    module.exports = new NodeFirestore()