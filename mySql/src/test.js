// A node demo program for creating the ECDH

// Importing the crypto module
const crypto = require('crypto');

// Initializing the algorithm
const algorithm = 'aes-256-cbc'; 
// Initializing the key
console.log("LENGTH =>",String(process.env.SECRET_KEY).length)
console.log("SECRET_KEY =>",String(process.env.SECRET_KEY))
const key =  String(process.env.SECRET_KEY)
// Initializing the iv vector
const iv =  "b8f3c1e7a2d6f9b4"

// Creating the function to encrypt data
function encrypt(text) {

// Creating the cipher with the above defined parameters
let cipher = crypto.createCipheriv(
   'aes-256-cbc', key,iv);

let encrypted = cipher.update(text);

encrypted = Buffer.concat([encrypted, cipher.final()]);

// Returning iv and the encrypted data
return { iv: iv.toString('hex'),
   encryptedData: encrypted.toString('hex') };
}
// Printing public & private curve keys...
var output = encrypt("TutorialsPoint");
console.log(output);