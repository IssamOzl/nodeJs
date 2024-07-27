import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import { params } from '../dtos/params.dto'


export const find = async() => { 
    let QUERY = "select * from general_settings;"
    try {
        const client = await pool.getConnection()
        const [rows, fields]= await client.query(QUERY)
        client.release();
        const parameters:params[] = rows as params[]
        return parameters[0]
    } catch (error) {
        throw error
    }
}

// export const findByName = async (name:getParamByName)=>{
    
//     try {
//         const QUERY = "select "+name.name+" as value from general_settings;"
//         const client = await pool.getConnection()
        
//         const [rows, fields] = await client.query(QUERY)
//         client.release()
//         const res = rows as getParamByNameVal[] 
        
//         return  res[0] as getParamByNameVal
//     } catch (error) {
//         throw error
//     }
    
// }