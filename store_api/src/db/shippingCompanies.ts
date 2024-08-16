import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import {shippingCompany} from "../dtos/shippingCompanies.dto"
import { log } from 'console'

export const active_shipping_companies = async ()=>{
    try {
        const QUERY="select shipping_id ,shipping_name ,shipping_status FROM `inventory_order_shipping` WHERE `shipping_status`=1;"
        const client = await pool.getConnection()
        const [rows,fields] = await pool.query(QUERY)
        client.release() 
        
        const shippingCompanies : shippingCompany[] = rows  as shippingCompany[]
        
        return shippingCompanies;

    } catch (error) {
        throw error
    }
}
export const default_shipping_company = async ()=>{
    try {
       
        // TODO: check error returned by thi commented query / can not recognise added field default

        const QUERY="select shipping_id ,shipping_name ,shipping_status FROM `inventory_order_shipping` WHERE shipping_default=1;"
        //const QUERY="select shipping_id ,shipping_name ,shipping_status FROM `inventory_order_shipping` WHERE shipping_id = (select min(shipping_id) from inventory_order_shipping where  `shipping_status`=1 limit 1);"
        const client = await pool.getConnection()
        const rows:any = await pool.query(QUERY)
        console.log(rows);
        
        client.release() 

        const defShippingCompany:shippingCompany = rows[0]  as shippingCompany      
        return defShippingCompany;

    } catch (error) {
        console.log(error);
        
        throw error
    }
}

