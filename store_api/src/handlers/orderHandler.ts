import Express,{ Request, Response, NextFunction } from 'express';
import { order } from '../dtos/orders.dto';
import { add } from '../db/ordersQueries';
import {body,validationResult,ValidationError, ExpressValidator} from 'express-validator'
import { countKeysExists, dbErrorReturn, insertQueryRes, validationErrorArray,activeInDb } from '../dtos/global.dto';
import { CustomValidation } from 'express-validator/lib/context-items';
import { DB_HOST } from '../utils/consts';
import { formatDbErrorMessage } from '../utils/helper';
import { shipping_id_count } from '../db/shippingCompanies';
import {count_id_in_table} from '../db/globalQueries'
import { check_variation_stock } from '../db/productsQueries';
import { productVariations } from '../dtos/products.dto'; 
 
let variation:productVariations
let variationsTable : productVariations[] = [] 

// validation chain to validate the object sent
export const place_order_validation = [
    body("order_address")
        .trim().notEmpty().withMessage("order_adress can not be empty"), 
    body("order_name")
        .trim().notEmpty().withMessage("order_name can not be empty"),  
    body("order_phone")
        .trim().notEmpty().withMessage("order_phone can not be empty")
        .trim().isLength({min:8,max:20}).withMessage("order_phone must be between 8 and 20 carracters long"), 
    body("order_shipping") // optional if not exist will be replaced by the default shipping company
        .optional()
        .isInt({min:1}).withMessage("order_shipping must be a positive number")
        .custom(async (value) => {
            const existOrderShipping:countKeysExists = await count_id_in_table("inventory_order_shipping","shipping_id",value);
            if (existOrderShipping.count_keys <=0) {
              // Will use the below as the error message
              throw new Error('wrong order_shipping passed');
            }
        })
        ,
    body("order_shipping_id") // optional if not exist will be replaced by the default shipping company
        .optional()
        .isInt({min:1}).withMessage("order_shipping_id must be a positive number")
        .custom(async (value) => {
            const existOrderShipping:countKeysExists = await count_id_in_table("inventory_order_shipping","shipping_id",value);
            
            if (existOrderShipping.count_keys <=0) {
              // Will use the below as the error message
              throw new Error('wrong order_shipping_id passed');
            }
        }),
    // body("order_created_date") // optional if not exist will be replaced by the today's date
    //     .optional()
    //     .isDate({format: 'YYYY-MM-DD'}).withMessage("order_created_date must respect this format : YYYY-MM-DD"), 
    body("order_date") // optional if not exist will be replaced by the today's date
        .optional()
        .isDate({format: 'YYYY-MM-DD'}).withMessage("order_date must respect this format : YYYY-MM-DD"),  
    body("order_shipping_city") // the existance of the id passed will verified later
        .isInt({min:1}).withMessage("order_shipping_city must be a positive number")
        .custom(async (value)=>{
            const existShippingCity:countKeysExists = await count_id_in_table("inventory_order_city","id",value);
            if (existShippingCity.count_keys <=0) {
              // Will use the below as the error message
              throw new Error('wrong order_shipping_city passed');
            }
        }),  
    body("order_shipping_cost")// from the shipping city we will get the cost
        .optional()
        .isInt({min:0}).withMessage("order_shipping_cost must be >= 0"),        
    body("order_status") // will be replaced by to_confirm if empty
        .optional()
        .equals("to_confirm"||"pending"||"annule"||"to_notify"||"encours"||"no_answer"||"livre"||"retour")
            .withMessage("order_status must have one of these values : to_confirm, pending, annule, to_notify, encours, no_answer, livre, retour"),     
    body("order_total")// to ba calculated 
        .optional()
        .isFloat({min:0}).withMessage("order_total must be a positive numeric"), 
    body("payment_status") // will be replaced by cash if not exist
        .optional()
        .equals("cash"||"credit").withMessage("payment_status must have one of these values : cash, credit"),
    body("user_id") // check if the user id passed exist's in db, if not will be replaced by null
        .optional()
        .isInt({min:1}).withMessage("user_id mut be a positive number")
        .custom(async (value)=>{
            const existUserId:countKeysExists = await count_id_in_table("user_details","user_id",value);
            if (existUserId.count_keys <=0) {
              // Will use the below as the error message
              throw new Error('wrong user_id passed');
            }
        }),     
    body("products")
        .isArray({ min: 1}).withMessage("You can not place an order without products !"),       
    body("products.*.id_variation") // check later if the id exists and has a positive stock 
        .isInt({min:1}).withMessage("id_variation must be an integer >=1")
        .custom(async (value)=>{
            const existsVariationId:countKeysExists = await count_id_in_table("product_variations","id",value);
            if (existsVariationId.count_keys <=0) {
              // Will use the below as the error message
              throw new Error('wrong id_variation passed');
            }else{
                // get variation
                console.log("check_variation_stock , var_id : "+value);
                variation = await check_variation_stock(value)
                console.log("Variation got : "+JSON.stringify(variation));
                variationsTable.push(variation)
                //bodyVariations.push(variation)
                if(variation.status != 'active'){
                    throw new Error('Variation is not active');
                }
            }
            
        }), 
    body("products.*.product_id") // check later if the id exists and has a positive stock 
        .isInt({min:1}).withMessage("product_id must be an integer >=1")
        .custom(async (value,{path})=>{ 

            const parts = path.split(/[\[\]\.]+/); // Regex splits on any '[' or ']' or '.'
            const index:number = parts[1] as unknown as number;
            
            // check if the product ID passed exist's in DB
            const existsProductId:countKeysExists = await count_id_in_table("product","product_id",value);
            if (existsProductId.count_keys <=0) {
                // Will use the below as the error message
                throw new Error('wrong product_id passed');
            }
            // check if variation belong's to product
            console.log("index",index);
                console.log("variationsTable[index] ",variationsTable[index]);
                console.log("product_id ",value);
             if(value !== variationsTable[index].id_produit){
                 throw new Error('variation does not belong to the product');
            }
        
        }
    ),          
    body("products.*.quantity") // check later if the id exists and has a positive stock 
        .isInt({min:1}).withMessage("quantity must be an integer >=1")
        .custom(async (value,{path})=>{
            
            const parts = path.split(/[\[\]\.]+/); // Regex splits on any '[' or ']' or '.'
            const index:number = parts[1] as unknown as number;

            if(value>variationsTable[index].stock){
                throw new Error('Quantity ordered is bigger than the stock available')
            }
        })
    //price will get it from producst_id    
]



export async function place_order(request:Request<{},{},order>,response:Response<insertQueryRes | validationErrorArray|dbErrorReturn>) {
    try {
        variationsTable = []
        const resValidation = validationResult(request)
        if(!resValidation.isEmpty()){
            return response.status(400).json({"Errors":resValidation.array()});
        }
        const orderInfos:order = request.body
        const insertId:insertQueryRes = await add(orderInfos)
        if(insertId.insertId>0)
        {
            return response.status(201).json()
        }else{
            return response.status(500).json(formatDbErrorMessage({"Errors":"Error occured while handling your request, please try again later."}))
        }
    } catch (error) {
        return response.status(500).json(formatDbErrorMessage(error))
    }
}