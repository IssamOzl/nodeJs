import { Request, Response } from "express";
import {shippingCompany} from "../dtos/shippingCompanies.dto"
import { active_shipping_companies,default_shipping_company } from "../db/shippingCompanies";

export async function get_active_shipping_companies(request:Request,response:Response) {
    try {
        const shippingCompanies : shippingCompany[] = await active_shipping_companies()
        return response.status(200).send(shippingCompanies)
    } catch (error) {
        return response.sendStatus(500)
    }
}

export async function get_default_shipping_company(request:Request,response:Response) {
    try {
       
        
        const defShippingCompany : shippingCompany = await default_shipping_company()
        return response.status(200).send(defShippingCompany)
    } catch (error) {
        return response.sendStatus(500)
    }
}