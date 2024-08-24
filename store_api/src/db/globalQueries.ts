import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import { countKeysExists } from '../dtos/global.dto'

export const count_id_in_table = async (table_name:string,id_col_name:string,id_col_value:number)=>{
    try { 
        const QUERY="select count("+id_col_name+") as count_keys  FROM "+table_name+" WHERE "+id_col_name+"=?;"
        //const QUERY="select shipping_id ,shipping_name ,shipping_status FROM `inventory_order_shipping` WHERE shipping_id = (select min(shipping_id) from inventory_order_shipping where  `shipping_status`=1 limit 1);"
        const client = await pool.getConnection()
        const rows:any = await pool.query(QUERY,[id_col_value])        
        client.release() 


        const countKeys:countKeysExists = rows[0][0]  as countKeysExists
        return countKeys;

    } catch (error) {
        throw error
    }
}    