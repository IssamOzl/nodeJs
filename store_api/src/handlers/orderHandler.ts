import { Request, Response, NextFunction } from 'express';
import { order } from '../dtos/orders.dto';
import { add } from '../db/ordersQueries';
import {body,validationResult,ValidationError} from 'express-validator'
import { insertQueryRes, validationErrorArray } from '../dtos/global.dto';

// validation chain to validate the object sent
export const place_order_validation = [
    body("order_address")
        .exists().withMessage("Missing parameter : order_address")
        .trim().isEmpty().withMessage("order_adress can not be empty"), 
    body("order_name")
        .exists().withMessage("Missing parameter : order_name")
        .trim().isEmpty().withMessage("order_name can not be empty"),  
    body("order_phone")
        .exists().withMessage("Missing parameter : order_phone")
        .trim().isEmpty().withMessage("order_phone can not be empty")
        .isLength({min:8,max:20}).withMessage("order_phone must be between 8 and 20 carracters long"), 
    body("order_shipping") // optional if not exist will be replaced by the default shipping company
        .optional()
        .isInt({min:1}).withMessage("inventory_order_shipping must be a positive number"),
    body("order_shipping_id") // optional if not exist will be replaced by the default shipping company
        .optional()
        .isInt({min:1}).withMessage("inventory_order_shipping must be a positive number"),
    body("order_created_date") // optional if not exist will be replaced by the today's date
        .optional()
        .isDate({format: 'YYYY-MM-DD'}).withMessage("order_created_date must respect this format : YYYY-MM-DD"), 
    body("order_date") // optional if not exist will be replaced by the today's date
        .optional()
        .isDate({format: 'YYYY-MM-DD'}).withMessage("order_date must respect this format : YYYY-MM-DD"),  
    body("order_shipping_city") // the existance of the id passed will verified later
        .exists().withMessage("Missing parameter : order_shipping_city")
        .isInt({min:1}).withMessage("order_shipping_city must be a positive number"),  
    body("order_shipping_cost")
        .optional()
        .isInt({min:0}).withMessage("order_shipping_cost must be >= 0"),        
    body("order_status") // will be replaced by to_confirm if empty
        .optional()
        .equals("to_confirm"||"pending"||"annule"||"to_notify"||"encours"||"no_answer"||"livre"||"retour")
            .withMessage("to_confirm must have one of these values : to_confirm, pending, annule, to_notify, encours, no_answer, livre, retour"),     
    body("order_total")
        .optional()
        .isFloat({min:0}).withMessage("order_total must be a positive numeric"), 
    body("payment_status") // will be replaced by cash if not exist
        .optional()
        .equals("cash"||"credit").withMessage("payment_status must have one of these values : cash, credit"),
    body("user_id") // check if the user id passed exist's in db, if not will be replaced by null
        .optional()
        .isInt({min:0}).withMessage("user_id mut be a positive number"),     
    // TODO: check how to validate products array 
]

export async function place_order(request:Request<{},{},order>,response:Response<insertQueryRes | validationErrorArray>) {
    try {
        const resValidation = validationResult(request)
        if(!resValidation.isEmpty()){
            console.log({"Errors":resValidation.array()});
            return response.status(401).send({"Errors":resValidation.array()});
        }
        const orderInfos:order = request.body
        console.log(orderInfos);
        const insertId:insertQueryRes = await add(orderInfos)

        return response.status(201).send(insertId)
    } catch (error) {
        return response.status(500)
    }
}