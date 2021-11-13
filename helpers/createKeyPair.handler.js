const {generateKeyPairSync} = require('crypto')
const {writeFileSync} = require('fs')
const {resolve} = require('path')

const {publicKey, privateKey} = generateKeyPairSync('rsa', {
    modulusLength:4096,
    publicKeyEncoding:{
        type: 'pkcs1',
        format:'pem'
    },
 
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    }
    
})

writeFileSync(resolve(__dirname+`/../environment/pub.pem`) , publicKey.toString());

writeFileSync(resolve(__dirname+`/../environment/priv.pem`), privateKey.toString());
