import { Request, Response } from "express";
import { categories } from "../dtos/categories.dto";
import {find} from "../db/categoriesQueries"
import { formatDbErrorMessage } from "../utils/helper";
import { dbErrorReturn } from "../dtos/global.dto";

export async function getCategories(request:Request,response:Response<categories[]|dbErrorReturn>) {
    try {
        const cats:categories[] = await find()
        if(cats){
            return response.status(200).send(cats)
        }else{
            return response.status(404)
        }
        
    } catch (error) {
        return response.status(500).send(formatDbErrorMessage(error))
    }
}

export async function getActiveCategories(request:Request,response:Response<categories[]|dbErrorReturn>) {
    try {
        const cats:categories[] = await find(false)
        if(cats){
            return response.status(200).send(cats)
        }else{
            return response.status(404)
        }
        
    } catch (error) {
        return response.status(500).send(formatDbErrorMessage(error))
    }
}