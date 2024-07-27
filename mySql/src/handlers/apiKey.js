const { v4: uuidv4, validate } = require('uuid');
const { find, findByCryptedKey, updateUsageCount } = require('../db/apiKeyQueries');
const bcrypt = require("bcryptjs");
const { hashedPassword, encryptKey } = require('../utils/helper');


async function  genApiKey(){
    let count = 1
    let key
    let hashedKey
    let resQuery 
    do {
        key = uuidv4()
        resQuery =  await find(key)
        count = JSON.stringify(resQuery.count_keys)
      }
      while (count >0);
      console.log("generated key ==>",key)
      hashedKey = encryptKey(key)
      console.log("encrypted key ==>",hashedKey)
      return [key,hashedKey]
}
async function incrementUsageCount(crypted_key,to_zero){
    const resQuery2 = await updateUsageCount(crypted_key,to_zero) 
    const affectedRows = JSON.stringify(resQuery2[0].affectedRows)
    return affectedRows
}
async function validateApiKey(req,res,next)
{
    console.log("validateApiKey ...");
   if(req.get('x-api-key'))
    {
        // get details based on APIKEY
        const key = req.get('x-api-key')
        const crypted_key = encryptKey(key)
        console.log("crypted_key",crypted_key)
        const resQuery = await findByCryptedKey(crypted_key)
        if(resQuery){
            if(resQuery.host == req.get('host')){

            }else{
                res.status(401).send("Not authorized") 
            }
            // i have a weird error of getting date -1
            const toDay = new Date(Date.now() - 86400000).toISOString().split('T')[0]
            const lastConnDate= resQuery.usage_date.toISOString().split('T')[0]

            console.log("toDay =>",toDay)
            console.log("lastConnDate =>",lastConnDate)

           if(toDay==lastConnDate){ 
           // for test  
           //if('2024-06-30'==lastConnDate){ 
                if(resQuery.usage_count > process.env.MAX_REQ_NUM){
                    res.status(401).send("Daily limit reached") 
                }else{
                    //++ usage_count
                    const affectedRows = await incrementUsageCount(crypted_key,false)
                    if(affectedRows == 1){
                        next()
                    }else{
                        res.status(500).send("Internal Server Error")
                    }
                }
            }else{
                    // usage_count = 1
                    const affectedRows = incrementUsageCount(crypted_key,true)
                    if(affectedRows == 1){
                        next()
                    }else{
                        res.status(500).send("Internal Server Error")
                    }
            }
        }else{
            res.status(401).send("Not authorized") 
        }
    }else{
        res.status(401).send("Missing x-api-key")
    }
}
 

module.exports = {
    genApiKey,
    validateApiKey
}