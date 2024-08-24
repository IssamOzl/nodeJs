import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import { shippingCity } from '../dtos/shippingCity.dto'

export const active_shipping_cities = async ()=>{
    try {
        const QUERY="SELECT id, name, shupping_cost FROM inventory_order_city;"
        const client = await pool.getConnection()
        const [rows,fields] = await pool.query(QUERY)
        client.release() 
        
        const shippingCities : shippingCity[] = rows  as shippingCity[]
        
        return shippingCities;

    } catch (error) {
        throw error
    }
}
export const shipping_city_details = async (id:number)=>{
    try {
        const QUERY="SELECT id, name, shupping_cost FROM inventory_order_city where id=?;"
        const client = await pool.getConnection()
        const rows:any = await pool.query(QUERY,[id])
        client.release() 
        
        const shippingCity : shippingCity = rows[0][0]  as shippingCity
        
        return shippingCity;

    } catch (error) {
        throw error
    }
}