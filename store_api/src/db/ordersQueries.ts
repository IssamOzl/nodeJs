import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {pool} from './conn'
import { order, order_product } from '../dtos/orders.dto'
import { dbError, insertQueryRes, updateQueryRes } from '../dtos/global.dto'
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

        const pricePromises = orderInfos.products.map(async (prod_var,index)=>{
            const basePriceShipping:prodBasePriceShipping = await prod_base_price_shipping(prod_var.product_id)
            orderInfos.products[index].price = basePriceShipping.product_base_price
            orderProductsTotal+=  basePriceShipping.product_base_price
            if(basePriceShipping.free_shipping == 0 && isFreeShipping){
                isFreeShipping = false
            }
        })

        // Wait for all price promises to resolve
        const productsWithPrices = await Promise.all(pricePromises);
        if(!isFreeShipping)
        {
            //order_shipping_cost: must get it from shipping company if one of the products has shipping cost active
            
            const shipCity:shippingCity = await shipping_city_details(orderInfos.order_shipping_city)
            orderInfos.order_shipping_cost = shipCity.shupping_cost
        }
      
        orderInfos.order_total = orderProductsTotal+ orderInfos.order_shipping_cost 

        // payment_status : will be replaced by cash if not exist
        if(!orderInfos.payment_status){
            orderInfos.payment_status = "cash"
        }
      return orderInfos;
        
    } catch (error) {
        throw error
    }
}
async function delete_order(orderId:number) {
    try {
        let isOK:boolean = false
        const QUERY="DELETE FROM `inventory_order` WHERE `inventory_order_id` = ?"
        const client = await pool.getConnection()
        const res = await client.query(QUERY,[orderId])
        const deleteRes:insertQueryRes = res[0] as insertQueryRes
        if(deleteRes.affectedRows == 1) isOK=true
        return isOK
    } catch (error) {
        throw error
    }
}
export async function add(orderInfos:order) {
    try {
       const updatedOrderInfos:order = await validateOrderBeforeAdd(orderInfos)

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
            updatedOrderInfos.order_total,
            updatedOrderInfos.order_date,
            updatedOrderInfos.order_name,
            updatedOrderInfos.order_address,
            updatedOrderInfos.payment_status,
            updatedOrderInfos.order_created_date,
            updatedOrderInfos.order_phone,
            updatedOrderInfos.order_status,
            updatedOrderInfos.order_shipping,
            updatedOrderInfos.order_shipping_cost,
            updatedOrderInfos.order_shipping_city,
            updatedOrderInfos.order_tracking,
            updatedOrderInfos.order_shipping_id,
            updatedOrderInfos.coupon 
        ])
       
        client.release(); 
        const insertedId:insertQueryRes = res[0] as insertQueryRes
        const isOK:boolean = await add_products_to_order(insertedId.insertId,updatedOrderInfos.products)
        if(isOK){
            return insertedId
        }else{
            
            const delRes:boolean = await delete_order(insertedId.insertId)
            insertedId.insertId=-1
            return insertedId
        }
        
    } catch (error) {
        throw error
    }
}
// async function update_product_quantities(products:order_product[]) {
//     try {
//         let QUERY:string =""
//         products.map((product,index)=>{
//             QUERY +=`UPDATE product_variations SET  stock = stock - ${product.quantity} where id = ${product.id_variation};`
//         })

//          log(QUERY)
//         const client = await pool.getConnection()
//         const res = await client.query(QUERY,[])
//         log(res)

//     } catch (error) {
//         throw error
//     }
// }
async function add_products_to_order(order_id:number, products:order_product[]) {
    try {
        let isOK:boolean = false
        let QUERY:string = `
            INSERT INTO inventory_order_product
            ( inventory_order_id, product_id, quantity, price, tax, id_variation)
            VALUES 
        `
        let queryVals:string =""

        products.map((prod,index)=>{
            queryVals+=`
            (
                ${order_id},
                ${prod.product_id},
                ${prod.quantity},
                ${prod.price},
                0,
                ${prod.id_variation}
            )
            `
            if(index<products.length-1) queryVals+=','
        })

        QUERY+=queryVals
        const client = await pool.getConnection()
        const res = await client.query(QUERY)
        client.release(); 
        
        const queryRes:insertQueryRes = res[0]    as insertQueryRes
        if(queryRes.affectedRows == products.length)
        {
            isOK = true
        }
        return isOK;
    } catch (error) {
        throw error
    }
}