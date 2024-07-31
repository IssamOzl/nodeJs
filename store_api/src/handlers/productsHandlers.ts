import { Request, Response } from "express";
import { find } from "../db/paramsQueries";
import { Send } from "express-serve-static-core";
import { get_all_products_request, get_product_details_request, get_products_by_category_request, product } from "../dtos/products.dto";
import { all_prods, latest_ten_prods, prod_details, prods_by_category, random_prods } from "../db/productsQueries";
import { off } from "process";


export async function get_latest_ten_prods(request:Request,response:Response<product[]>){
    try {
        const prods:product[] = await latest_ten_prods()
        if(prods){
            return response.send(prods)
        }else{
            return response.status(500)
        }
        
    } catch (error) {
        //throw error
        return response.status(500)
    }
}
export async function get_prods_by_category(request:Request<{},{},{},get_products_by_category_request>,response:Response<product[]>){
    try {

        // TODO : validation
        // must be positive numbers
        const categorie_id:number = request.query.category_id;
        const limit:number = request.query.limit;
        const offset:number = request.query.offset;

        const prods:product[] = await prods_by_category(categorie_id,limit,offset,true)
        if(prods){
            return response.send(prods)
        }else{
            return response.status(500)
        }
        
    } catch (error) {
        //throw error
        return response.status(500)
    }
} 
export async function get_active_prods_by_category(request:Request<{},{},{},get_products_by_category_request>,response:Response<product[]>){
    try {

        // TODO : validation
        const categorie_id:number = request.query.category_id;
        const limit:number = request.query.limit;
        const offset:number = request.query.offset;

        const prods:product[] = await prods_by_category(categorie_id,limit,offset,false)
        if(prods){
            return response.send(prods)
        }else{
            return response.status(500)
        }
        
    } catch (error) {
        //throw error
        return response.status(500)
    }
} 
export async function get_all_prods(request:Request<{},{},{},get_all_products_request>,response:Response<product[]>){
    try {

        // TODO : validation
        const limit:number = request.query.limit;
        const offset:number = request.query.offset;

        const prods:product[] = await all_prods(limit,offset,true)
        if(prods){
            return response.send(prods)
        }else{
            return response.status(500)
        }
        
    } catch (error) {
        //throw error
        return response.status(500)
    }
} 
export async function get_all_active_prods(request:Request<{},{},{},get_all_products_request>,response:Response<product[]>){
    try {

        // TODO : validation
        const limit:number = request.query.limit;
        const offset:number = request.query.offset;

        const prods:product[] = await all_prods(limit,offset,false)
        if(prods){
            return response.send(prods)
        }else{
            return response.status(500)
        }
        
    } catch (error) {
        //throw error
        return response.status(500)
    }
} 

export async function get_product_details(request:Request<{},{},get_product_details_request>,response:Response<product>) {
    try {
        // TODO : validation
        const slug:string = request.body.slug
        const prods:product[] = await prod_details(slug)
        let STATUS = 500

        if(prods.length >1)
        {
            response.status(STATUS).send(prods[0])
        }else{
            STATUS = 200
            response.status(STATUS).send(prods[0])
        }

    } catch (error) {
        throw error
    }
}

export async function get_random_products(request:Request<{},{},get_product_details_request>,response:Response<product[]>) {
    try {
        // TODO : validation
        const slug:string = request.body.slug
        const prods:product[] = await random_prods(slug,3)
        let STATUS = 500

        if(prods.length >1)
        {
            response.status(STATUS).send(prods)
        }else{
            STATUS = 200
            response.status(STATUS).send(prods)
        }

    } catch (error) {
        throw error
    }
}