import e, { Request, Response } from "express";
import {shippingCompany} from "../dtos/shippingCompanies.dto"
import { active_shipping_companies,default_shipping_company } from "../db/shippingCompanies";
import { formatDbErrorMessage } from "../utils/helper";
import { dbErrorReturn } from "../dtos/global.dto";

export async function get_active_shipping_companies(request:Request,response:Response<shippingCompany[]|dbErrorReturn >) {
    try {
        const shippingCompanies : shippingCompany[] = await active_shipping_companies()
        if(shippingCompanies.length>0){
            return response.status(200).json(shippingCompanies)
        }else{
            return response.status(404).send()
        }
        
    } catch (error) {
        return response.status(500).json(formatDbErrorMessage(error))
    }
}

export async function get_default_shipping_company(request:Request,response:Response<shippingCompany|dbErrorReturn>) {
    try {
        
        const defShippingCompany : shippingCompany = await default_shipping_company()
        if(defShippingCompany.shipping_id){
            return response.status(200).json(defShippingCompany)
        }else{
            return response.status(404).send()
        }
        
    } catch (error) {
        return response.status(500).json(formatDbErrorMessage(error))
    }
}