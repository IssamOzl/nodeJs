import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import { apiKey, countKeysExists, updateQueryRes } from '../dtos/apiKey.dto'

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

export const findByCryptedKey= async (crypted_key:string)=>{
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

export const updateUsageCount = async (crypted_key:string,to_zero:boolean)=>{
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