const bcrypt = require("bcryptjs")
// Includes crypto module
const crypto = require('crypto');  
// Initializing the algorithm
const algorithm = 'aes-256-cbc';

// Initializing the key
const key = process.env.SECRET_KEY;

// Initializing the iv vector7
const iv = process.env.SECRET_IV;

function hashedPassword(pass){
    const salt = bcrypt.genSaltSync()
    return bcrypt.hashSync(pass,salt)
}

function checkPasswords(usrPass,dbPass){
    let isOk = false
    let msg = "Incorrect password"
    if (bcrypt.compareSync(usrPass, dbPass)) {
        msg=  "Correct password"
        isOk = true
    } 
    return {isOk,msg}
}

function encryptKey(text) {
    // Creating Cipheriv with its parameter
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    // Updating text
    let encrypted = cipher.update(text);
    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

function decryptKey(text){

 let encryptedText =
    Buffer.from(text.encryptedData, 'hex');
 
 // Creating Decipher
 let decipher = crypto.createDecipheriv(
        'aes-256-cbc', Buffer.from(key), iv);
 
 // Updating encrypted text
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 console.log("decrypted =W",decrypted)
 // returns data after decryption
 return decrypted.toString();
}
module.exports = {
    hashedPassword,
    checkPasswords,
    encryptKey,
    decryptKey,
}