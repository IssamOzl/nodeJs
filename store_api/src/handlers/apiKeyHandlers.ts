import { v4 as uuidv4 } from 'uuid';
import { find, findByCryptedKey, updateUsageCount } from '../db/apiKeyQueries';
import bcrypt from "bcryptjs";
import {hashedPassword,checkPasswords,encryptKey,decryptKey} from '../utils/helper'
import { apiKey, countKeysExists, updateQueryRes } from '../dtos/apiKey.dto';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const MAX_REQ_NUM:any = process.env.MAX_REQ_NUM 
const Max_REQ:number =  MAX_REQ_NUM as number
// import { IncomingHttpHeaders } from 'http';

// declare module 'http' {
//     interface IncomingHttpHeaders {
//         "XYZ-Token"?: string
//     }
// }
export async function  genApiKey(){
   
    let count:countKeysExists
    let key:string
    let hashedKey:string

    do {
        key = uuidv4()
        const resQuery =  await find(key)
        count = resQuery as countKeysExists

      }
      while (count.count_keys >0);
      console.log("generated key ==>",key)
      hashedKey = encryptKey(key)
      console.log("encrypted key ==>",hashedKey)
      return [key,hashedKey]
}

export async function incrementUsageCount(crypted_key:string,to_zero:boolean){
    const resQuery2:updateQueryRes = await updateUsageCount(crypted_key,to_zero) 
    return resQuery2
}

export async function validateApiKey(request:Request,response:Response,next:NextFunction)
{
    console.log("validateApiKey ...");
   if(request.get('x-api-key'))
    {
        // get details based on APIKEY
        const key:any = request.get('x-api-key')
        const crypted_key = encryptKey(key)
        console.log("crypted_key",crypted_key)
        const resQuery:apiKey = await findByCryptedKey(crypted_key)
        console.log("resQuery",resQuery);
        
        if(resQuery){
            // if(resQuery.host == request.get('host')){

            // }else{
            //     response.status(401).send("Not authorized") 
            // }
            const date:Date =  new Date(Date.now()-86400000)
            const toDay = date.toISOString().split('T')[0]
            let lastConnDate=""

            if(resQuery.usage_date){
                lastConnDate =  resQuery.usage_date.toISOString().split('T')[0]
            }

            console.log("toDay =>",toDay)
            console.log("lastConnDate =>",lastConnDate)

           if(toDay==lastConnDate){ 
           // for test  
           //if('2024-06-30'==lastConnDate){ 
                if(resQuery.usage_count > Max_REQ){
                    response.status(401).send("Daily limit reached") 
                }else{
                    //++ usage_count
                    const rowsRes:updateQueryRes = await incrementUsageCount(crypted_key,false)
                    if(rowsRes.affectedRows == 1){
                        next()
                    }else{
                        response.status(500).send("Internal Server Error")
                    }
                }
            }else{
                    // usage_count = 1
                    const rowsRes :updateQueryRes = await incrementUsageCount(crypted_key,true)
                    if(rowsRes.affectedRows == 1){
                        next()
                    }else{
                        response.status(500).send("Internal Server Error")
                    }
            }
        }else{
            response.status(401).send("Not authorized") 
        }
    }else{
        response.status(401).send("Missing x-api-key")
    }
}
 

// TODO : generate new api key and attach it to user
// TODO : create user with api key generation - return also uncrypted api key wih user object
// TODO : add apikey validation middleware
// TODO : limit number of requets by ip
