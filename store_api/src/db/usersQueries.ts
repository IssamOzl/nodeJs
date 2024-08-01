import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import { countKeysExists, updateQueryRes } from '../dtos/global.dto'
import { gen_api_key } from './apiKeyQueries'

// check if user exists with user_id passed as parameter
export const user_exist = async (user_id:number)=>{
    try {
        const QUERY="select count(*) as count_keys from user_details where user_id = ?"
        const client = await pool.getConnection()
        const [res,fields]:any = await pool.query(QUERY,[user_id])
        client.release() 
        
        const count_keys : countKeysExists = res[0] as countKeysExists
        
        return count_keys;

    } catch (error) {
        throw error
    }
}

// generate api key and attach it to user already exist
export const api_key_to_user = async (user_id:number, host:string="")=>{
    try {
        // check if user with the id passed exist in db
        const count:countKeysExists = await user_exist(user_id)
        const null_ret = [null,null]
        // user exist
        if(count.count_keys == 1){
            
            const [key,hashedKey] = await gen_api_key()
            if(key &&  hashedKey)
            {
                const QUERY = "update user_details set api_key = ? , host = ? where user_id = ?"
                const client = await pool.getConnection()
                const res:any = await client.query(QUERY,[hashedKey,host,user_id])
                const updateRes:updateQueryRes = res[0] as updateQueryRes
    
                // udate => OK
                if(updateRes.affectedRows = 1)
                {
                    return [key,hashedKey] 
                // udate => KO    
                }else{
                    return null_ret 
                }
            }else{
                return null_ret 
            }
            
        // user no exist    
        }else{
            return null_ret
        }

    } catch (error) {
        throw error
    }
}

// export const create_user = async ()=>{

// }