import { Request, Response } from "express";
import {shippingCompany} from "../dtos/shippingCompanies.dto"
import { active_shipping_companies,default_shipping_company } from "../db/shippingCompanies";
import { formatDbErrorMessage } from "../utils/helper";
import { dbErrorReturn } from "../dtos/global.dto";

export async function get_active_shipping_companies(request:Request,response:Response<shippingCompany[]|dbErrorReturn >) {
    try {
        const shippingCompanies : shippingCompany[] = await active_shipping_companies()
        return response.status(200).send(shippingCompanies)
    } catch (error) {
        return response.status(500).send(formatDbErrorMessage(error))
    }
}

export async function get_default_shipping_company(request:Request,response:Response<shippingCompany|dbErrorReturn>) {
    try {
       
        
        const defShippingCompany : shippingCompany = await default_shipping_company()
        return response.status(200).send(defShippingCompany)
    } catch (error) {
        return response.status(500).send(formatDbErrorMessage(error))
    }
}