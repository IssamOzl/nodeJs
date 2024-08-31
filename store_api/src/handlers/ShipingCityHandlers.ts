import { Request, Response } from "express";
import {shippingCity} from "../dtos/shippingCity.dto"
import { formatDbErrorMessage } from "../utils/helper";
import { dbErrorReturn, validationErrorArray } from "../dtos/global.dto";
import { active_shipping_cities,shipping_city_details } from "../db/shippingCityQueries";
import { query, validationResult } from "express-validator";
import { log } from "console";

export async function get_active_shipping_cities(request:Request,response:Response<shippingCity[]|dbErrorReturn >) {
    try {
        const shippingCities : shippingCity[] = await active_shipping_cities()
        return response.status(200).send(shippingCities)
    } catch (error) {
        return response.status(500).send(formatDbErrorMessage(error))
    }
}
export const get_shipping_city_details_validation = [
    query("id")
    .notEmpty().withMessage("id not passed")
    .isInt({min:1}).withMessage("id must be a positive integer")
]
export async function get_shipping_city_details(request:Request,response:Response<shippingCity|dbErrorReturn| validationErrorArray >) {
    try {
        const resValidation = validationResult(request)
        if(!resValidation.isEmpty()){
            return response.status(401).send({"Errors":resValidation.array()});
        }

        const id:number = request.query.id as unknown as number
        console.log("Id",id);
        
        const shippingCity : shippingCity = await shipping_city_details(id)
        return response.status(200).send(shippingCity)
    } catch (error) {
        return response.status(500).send(formatDbErrorMessage(error))
    }
}