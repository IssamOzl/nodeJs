import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import { order } from '../dtos/orders.dto'
import { log } from 'console'
import { dbError, insertQueryRes } from '../dtos/global.dto'

export async function add(orderInfos:order) {
    try {
        let QUERY = `
            INSERT INTO inventory_order
            (
                inventory_order_total,
                inventory_order_date,
                inventory_order_name,
                inventory_order_address,
                payment_status,
                inventory_order_created_date,
                inventory_order_phone,
                inventory_order_status,
                inventory_order_shipping,
                inventory_order_shipping_cost,
                inventory_order_shipping_city,
                inventory_order_tracking,
                inventory_order_shipping_id,
                coupon
            ) 
            VALUES 
            (
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?, 
                ?  
            )
        `
         
        
        const client = await pool.getConnection()
        const res = await client.query(QUERY,[
            orderInfos.order_total,
            orderInfos.order_date,
            orderInfos.order_name,
            orderInfos.order_address,
            orderInfos.payment_status,
            orderInfos.order_created_date,
            orderInfos.order_phone,
            orderInfos.order_status,
            orderInfos.order_shipping,
            orderInfos.order_shipping_cost,
            orderInfos.order_shipping_city,
            orderInfos.order_tracking,
            orderInfos.order_shipping_id,
            orderInfos.coupon
        ])
        client.release(); 
        const insertedId:insertQueryRes = res[0] as insertQueryRes
        console.log("insertId",insertedId.insertId);
        
        return insertedId
    } catch (error) {
        throw error
    }
}