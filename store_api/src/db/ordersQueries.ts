import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import { order } from '../dtos/orders.dto'
import { log } from 'console'
import { dbError, insertQueryRes } from '../dtos/global.dto'
import { shippingCompany } from '../dtos/shippingCompanies.dto'
import { default_shipping_company } from './shippingCompanies'
import { shippingCity } from '../dtos/shippingCity.dto'
import { shipping_city_details } from './shippingCityQueries'
import { prodBasePriceShipping, product } from '../dtos/products.dto' 
import { prod_base_price_shipping } from './productsQueries'

async function validateOrderBeforeAdd(orderInfos:order) {
    try {
        orderInfos.order_created_date = new Date()
        //order_shipping_id : optional if not exist will be replaced by the default shipping company
        if(!orderInfos.order_shipping_id){
            orderInfos.order_shipping_id = (await default_shipping_company()).shipping_id  
        }
        //order_shipping : optional if not exist will be replaced by the default shipping company
        if(!orderInfos.order_shipping){
            orderInfos.order_shipping = orderInfos.order_shipping_id as unknown as string
        }
        //order_date : optional if not exist will be replaced by the today's date
        if(!orderInfos.order_date){
            orderInfos.order_date = orderInfos.order_created_date 
        }
        if(!orderInfos.order_status){
            orderInfos.order_status = "to_confirm"
        }
        //order_total
        let orderProductsTotal:number = 0
        let isFreeShipping:boolean = true;

        await (async()=>{
                orderInfos.products.map(async (prod_var,index)=>{
                    const basePriceShipping:prodBasePriceShipping = await prod_base_price_shipping(prod_var.product_id)
                    
                     console.log("basePriceShipping",basePriceShipping);
                    orderProductsTotal+=  basePriceShipping.product_base_price
                    if(basePriceShipping.free_shipping == 0 && isFreeShipping){
                        isFreeShipping = false
                    }
                })
            
          
        })()

        console.log("isFreeShipping",isFreeShipping);
        if(!isFreeShipping)
        {
            
            //order_shipping_cost: must get it from shipping company if one of the products has shipping cost active
            const shipCity:shippingCity = await shipping_city_details(orderInfos.order_shipping_city)
            console.log("shipCity",shipCity);
            
            orderInfos.order_shipping_cost = shipCity.shupping_cost
        }
        orderInfos.order_total = orderProductsTotal+ orderInfos.order_shipping_cost 

        // payment_status : will be replaced by cash if not exist
        if(!orderInfos.payment_status){
            orderInfos.payment_status = "cash"
        }
        console.log("orderInfos",orderInfos);
        
    } catch (error) {
        throw error
    }
}
export async function add(orderInfos:order) {
    try {
        validateOrderBeforeAdd(orderInfos)

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