import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import { apiKey} from '../dtos/apiKey.dto'
import { countKeysExists, updateQueryRes } from '../dtos/global.dto'
import {hashedPassword,checkPasswords,encryptKey,decryptKey} from '../utils/helper'
import { v4 as uuidv4 } from 'uuid';

export const find = async (api_key:string)=>{
    try {
        const QUERY = "select count(*) as count_keys from user_details where api_key = ?"
        let returnCount:countKeysExists
        const client = await pool.getConnection()
        const rows:any = await client.query(QUERY,[api_key])
        client.release();
        returnCount = rows[0][0] as countKeysExists
        return returnCount
    } catch (error) {
        throw error
    }
}

export const find_by_crypted_key= async (crypted_key:string)=>{
    const QUERY = "select api_key,usage_date,usage_count,host  from user_details where api_key = ?"
    console.log("HERE 2")
    try {
        console.log("HERE 3")
        const client = await pool.getConnection()
        console.log("HERE 4 ")
        const rows:any = await client.query(QUERY,[crypted_key])
        console.log("res => ",rows);
        client.release();
        const api_key = rows[0][0] as apiKey
        console.log("api_key",api_key);
        
        return api_key
    } catch (error) {
        throw   error
    }
}

export const update_usage_count = async (crypted_key:string,to_zero:boolean)=>{
    let QUERY 
    console.log("to_zero",to_zero)
    
    if(!to_zero) {
        QUERY= "update user_details set usage_count = (usage_count+1), usage_date = ? where api_key = ? "
    }else{
        QUERY= "update user_details set usage_count = 1, usage_date = ? where api_key = ? "
    }
    try {
        const client = await pool.getConnection()
        const tod = new Date().toISOString().split('T')[0];
        console.log(QUERY,"QUERY");
        
        const res = await client.query(QUERY,[tod,String(crypted_key)])
        client.release();
        const affectedRows:updateQueryRes = res[0] as  updateQueryRes
        return affectedRows
    } catch (error) {
        console.log("error occured find() ",error)
        throw error
    }
}


export async function  gen_api_key(){
   
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
 
export async function increment_usage_count(crypted_key:string,to_zero:boolean){
    const resQuery2:updateQueryRes = await update_usage_count(crypted_key,to_zero) 
    return resQuery2
}