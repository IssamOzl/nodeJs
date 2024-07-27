import { Request, Response } from "express";
import { categories } from "../dtos/categories.dto";
import {find} from "../db/categoriesQueries"

export async function getCategories(request:Request,response:Response<categories[]>) {
    try {
        const cats:categories[] = await find()
        if(cats){
            return response.send(cats)
        }else{
            return response.status(500)
        }
        
    } catch (error) {
        return response.status(500)
    }
}

export async function getActiveCategories(request:Request,response:Response<categories[]>) {
    try {
        const cats:categories[] = await find(false)
        if(cats){
            return response.send(cats)
        }else{
            return response.status(500)
        }
        
    } catch (error) {
        return response.status(500)
    }
}