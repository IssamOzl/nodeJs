import Express,{ Request, Response, NextFunction } from 'express';
import { order } from '../dtos/orders.dto';
import { add } from '../db/ordersQueries';
import {body,validationResult,ValidationError, ExpressValidator} from 'express-validator'
import { countKeysExists, dbErrorReturn, insertQueryRes, validationErrorArray } from '../dtos/global.dto';
import { CustomValidation } from 'express-validator/lib/context-items';
import { log } from 'console';
import { DB_HOST } from '../utils/consts';
import { formatDbErrorMessage } from '../utils/helper';
import { shipping_id_count } from '../db/shippingCompanies';
 

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
            const existOrderShipping:countKeysExists = await shipping_id_count(value);
            if (existOrderShipping.count_keys <=0) {
              // Will use the below as the error message
              throw new Error('wrong order_shipping passed');
              
            }
        })
        ,
    body("order_shipping_id") // optional if not exist will be replaced by the default shipping company
        .optional()
        .isInt({min:1}).withMessage("order_shipping_id must be a positive number"),
    // body("order_created_date") // optional if not exist will be replaced by the today's date
    //     .optional()
    //     .isDate({format: 'YYYY-MM-DD'}).withMessage("order_created_date must respect this format : YYYY-MM-DD"), 
    body("order_date") // optional if not exist will be replaced by the today's date
        .optional()
        .isDate({format: 'YYYY-MM-DD'}).withMessage("order_date must respect this format : YYYY-MM-DD"),  
    body("order_shipping_city") // the existance of the id passed will verified later
        .isInt({min:1}).withMessage("order_shipping_city must be a positive number"),  
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
        .isInt({min:0}).withMessage("user_id mut be a positive number"),     
    body("products")
        .isArray({ min: 1}).withMessage("You can not place an order without products !"),
    body("products.*.id_variation") // check later if the id exists and has apositive stock 
        .isInt({min:1}).withMessage("id_variation must be an integer >=1"),  
    body("products.*.product_id") // check later if the id exists and has apositive stock 
        .isInt({min:1}).withMessage("product_id must be an integer >=1"),
    body("products.*.quantity") // check later if the id exists and has apositive stock 
        .isInt({min:1}).withMessage("quantity must be an integer >=1")
    //price will get it from producst_id    
]

export async function place_order(request:Request<{},{},order>,response:Response<insertQueryRes | validationErrorArray|dbErrorReturn>) {
    try {
        const resValidation = validationResult(request)
        if(!resValidation.isEmpty()){
            return response.status(401).send({"Errors":resValidation.array()});
        }
        const orderInfos:order = request.body
        console.log(orderInfos);
        const insertId:insertQueryRes = await add(orderInfos)

        return response.status(201).send(insertId)
    } catch (error) {
        return response.status(500).send(formatDbErrorMessage(error))
    }
}