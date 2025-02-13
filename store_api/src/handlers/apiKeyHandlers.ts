import { find, find_by_crypted_key, increment_usage_count, update_usage_count } from '../db/apiKeyQueries';
import bcrypt from "bcryptjs";
import {hashedPassword,checkPasswords,encryptKey,decryptKey, formatDbErrorMessage} from '../utils/helper'
import { v4 as uuidv4 } from 'uuid';
import { apiKey} from '../dtos/apiKey.dto';
import { countKeysExists, updateQueryRes } from '../dtos/global.dto';
import { Request, Response, NextFunction } from 'express';
import { query,header, matchedData, validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();


const MAX_REQ_NUM:any = process.env.MAX_REQ_NUM 
const Max_REQ:number =  MAX_REQ_NUM as number



export function validateApiKeyValidation(request:Request,response:Response,next:NextFunction)
{
    if(request.originalUrl.includes("/api-docs")){
        return next()
    }
    const key:string = request.get('x-api-key') as string
    if(key && key.length>20 ) {
        return next()
    }else{
        return response.status(400).json({Error:"ApiKey must be at least 20 carracters"});
    }

}
export async function validateApiKey(request:Request,response:Response,next:NextFunction)
{
    
    if(request.originalUrl.includes("/api-docs")){
        return next()
    }
    // const result = validationResult(request);
    // if (result.isEmpty()) {
    //     console.log("EMpty");
    // }
    // else
    // { 
    //     response.send({ errors: result.array() });
    // }
    try {
        if(request.get('x-api-key'))
        {
            // get details based on APIKEY
            const key:any = request.get('x-api-key')
            const crypted_key = encryptKey(key)
            const resQuery:apiKey = await find_by_crypted_key(crypted_key)        
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
            if(toDay==lastConnDate){ 
            // for test  
            //if('2024-06-30'==lastConnDate){ 
                    if(resQuery.usage_count > Max_REQ){
                        return response.status(401).json({Error:"Daily limit reached"}) 
                    }else{
                        //++ usage_count
                        const rowsRes:updateQueryRes = await increment_usage_count(crypted_key,false)
                        if(rowsRes.affectedRows == 1){
                            return  next()
                        }else{
                            return response.status(500).json({Error:"Internal Server Error"})
                        }
                    }
                }else{
                        // usage_count = 1
                        const rowsRes :updateQueryRes = await increment_usage_count(crypted_key,true)
                        if(rowsRes.affectedRows == 1){
                            next()
                        }else{
                            return  response.status(500).json({Error:"Internal Server Error"})
                        }
                }
            }else{
                response.status(401).json({Error:"Not authorized"})
            }
        }else{
            response.status(401).json({Error:"Missing x-api-key"})
        }
    } catch (error) {
        
        return response.status(500).json(formatDbErrorMessage(error))
    }

  
}
 

// TODO : generate new api key and attach it to user
// TODO : create user with api key generation - return also uncrypted api key wih user object
// TODO : add apikey validation middleware
// TODO : limit number of requets by ip
