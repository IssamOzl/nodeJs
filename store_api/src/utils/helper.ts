import bcrypt from 'bcryptjs'
import crypto, { BinaryLike } from 'crypto'

import dotenv from 'dotenv';
import { dbError } from '../dtos/global.dto';
import { myErrorLogger } from '../handlers/logger';
dotenv.config();


// Initializing the algorithm
const algorithm:string = 'aes-256-cbc';


// Initializing the key
const key:any = process.env.SECRET_KEY

// Initializing the iv vector7
const iv:BinaryLike = process.env.SECRET_IV as BinaryLike;

export function hashedPassword(pass:string):string{
    const salt = bcrypt.genSaltSync()
    return bcrypt.hashSync(pass,salt)
}

export function checkPasswords(usrPass:string,dbPass:string){
    let isOk = false
    let msg = "Incorrect password"
    if (bcrypt.compareSync(usrPass, dbPass)) {
        msg=  "Correct password"
        isOk = true
    } 
    return {isOk,msg}
}

export function encryptKey(text:string):string {
    // Creating Cipheriv with its parameter
    let cipher = crypto.createCipheriv('aes-256-cbc', key as crypto.CipherKey, iv);
    // Updating text
    let encrypted = cipher.update(text);
    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

export function decryptKey(encryptedData:string):string{

 let encryptedText =
    Buffer.from(encryptedData, 'hex');
 
 // Creating Decipher
 let decipher = crypto.createDecipheriv(
        'aes-256-cbc', Buffer.from(key), iv);
 
 // Updating encrypted text
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 // returns data after decryption
 return decrypted.toString();
}
export function formatDbErrorMessage(error:any){
    const myError:dbError = error as dbError
    myErrorLogger.error(error)
    return {"Errors":{"message":myError.message,"code":myError.code,"errno":myError.errno}}
} 