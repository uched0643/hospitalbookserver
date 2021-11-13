const {randomBytes, pbkdf2Sync} = require('crypto');


const hashPassword = (password) => {
    const salt = randomBytes(16).toString('hex')
    const hash =  pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex')
    return [salt, hash].join('$')
}

const verifyHash = (password, original) => {
    const originalHash = original.split('$')[1];
    const salt = original.split('$')[0];
    const hash = pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex')

    (hash !== originalHash)? false : true
}

module.exports = {hashPassword, verifyHash}

