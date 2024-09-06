import { NextFunction,Request,Response } from 'express';
import { find } from "../db/paramsQueries";
import { Send } from "express-serve-static-core";
import { get_all_products_request, get_product_details_request, get_products_by_category_request, product } from "../dtos/products.dto";
import { all_prods, latest_ten_prods, prod_details, prods_by_category, random_prods } from "../db/productsQueries";
import { off } from "process";
import { body, check, query, ValidationError, validationResult } from "express-validator";
import { dbErrorReturn, validationErrorArray } from '../dtos/global.dto';
import { formatDbErrorMessage } from '../utils/helper';

export async function get_latest_ten_prods(request:Request,response:Response<product[]>){
    try {
        const prods:product[] = await latest_ten_prods()
        if(prods){
            return response.status(200).send(prods)
        }else{
            return response.status(404).send(prods)
        }
        
    } catch (error) {
        //throw error
        return response.status(500)
    }
}
export const get_prods_by_category_validation  = [
    query("category_id")
        .trim().notEmpty().withMessage("missing parameter : category")
       .isInt({min:1}).withMessage("category_id must be an integer"),
    query("limit")
        .trim().notEmpty().withMessage("missing parameter : limit")
        .isInt({min:1,max:60}).withMessage("limit must be between 1 and 60"),
    query("offset")
        .optional()
        .isInt({min:0}).withMessage("offset must be greater or equal 0")
];
 
export async function get_prods_by_category(request:Request<{},{},{},get_products_by_category_request> ,response:Response<product[]|validationErrorArray|dbErrorReturn>){
    try {
    
        const resValidation = validationResult(request);
        
        if (!resValidation.isEmpty()) {
           return response.status(400).send({"Errors":resValidation.array()} );
        }

       // const{ category_id ,limit,offset} = request.query as unknown as get_products_by_category_request

        const category_id:number = request.query.category_id;
        const limit:number = request.query.limit;
        const offset:number = request.query.offset;
        
        const prods:product[] = await prods_by_category(category_id,limit,offset,true)
        if(prods.length >0){
            return response.status(200).send(prods)
        }else{
            return response.status(404).send(prods)
        }
    } catch (error) {
        //throw error
        return response.status(500).send(formatDbErrorMessage(error))
    }
} 
export async function get_active_prods_by_category(request:Request<{},{},{},get_products_by_category_request>,response:Response<product[]|validationErrorArray|dbErrorReturn>){
    try {

        const resValidation = validationResult(request);
        
        if (!resValidation.isEmpty()) {
            response.status(400).send({"Errors":resValidation.array()} );
        }
        const category_id:number = request.query.category_id;
        const limit:number = request.query.limit;
        const offset:number = request.query.offset;

        const prods:product[] = await prods_by_category(category_id,limit,offset,false)
        
        if(prods.length >0){
            return response.status(200).send(prods)
        }else{
            return response.status(404).send(prods)
        }
        
    } catch (error) {
        //throw error
        return response.status(500).send(formatDbErrorMessage(error))
    }
} 


export const get_all_prods_validation  = [
    query("limit")
        .trim().notEmpty().withMessage("missing parameter : limit")
        .isInt({min:1,max:60}).withMessage("limit must be between 1 and 60"),
    query("offset")
        .optional()
        .isInt({min:0}).withMessage("offset must be greater or equal 0")
];
export async function get_all_prods(request:Request<{},{},{},get_all_products_request>,response:Response<product[]|validationErrorArray|dbErrorReturn>){
    try {
        const resValidation = validationResult(request);
        
        if (!resValidation.isEmpty()) {
            response.status(400).send({"Errors":resValidation.array()} );
        }

        const limit:number = request.query.limit;
        const offset:number = request.query.offset;

        const prods:product[] = await all_prods(limit,offset,true)
        if(prods){
            return response.status(200).send(prods)
        }else{
            return response.status(404).send(prods)
        }
        
    } catch (error) {
        //throw error
        return response.status(500).send(formatDbErrorMessage(error))
    }
} 
export async function get_all_active_prods(request:Request<{},{},{},get_all_products_request>,response:Response<product[]|validationErrorArray|dbErrorReturn>){
    try {
        const resValidation = validationResult(request);
        
        if (!resValidation.isEmpty()) {
            response.status(400).send({"Errors":resValidation.array()} );
        }

        const limit:number = request.query.limit;
        const offset:number = request.query.offset;

        const prods:product[] = await all_prods(limit,offset,false)
        if(prods){
            return response.status(200).send(prods)
        }else{
            return response.status(404).send(prods)
        }
        
        
    } catch (error) {
        //throw error
        return response.status(500).send(formatDbErrorMessage(error))
    }
} 
export const get_product_details_validation = [
    query("slug")
        .trim().notEmpty().withMessage("Missing body parameter : slug")
        .isLength({ min: 8 })
]
export async function get_product_details(request:Request<{},{},{},get_product_details_request>,response:Response<product|validationErrorArray|dbErrorReturn>) {
    try {
        const resValidation = validationResult(request);
        
        if (!resValidation.isEmpty()) {
           return response.status(400).send({"Errors":resValidation.array()} );
        }

        const slug:string = request.query.slug
        const prods:product[] = await prod_details(slug)
        // the slug is unique so we should only get one product only
        const prodRet :product = prods[0]
        if(prods.length =0)
        {
            return response.status(404).send(prodRet)
        }else{
            return response.status(200).send(prodRet)
        }

    } catch (error) {
        return response.status(500).send(formatDbErrorMessage(error))
    }
}

export async function get_random_products(request:Request<{},{},{},get_product_details_request>,response:Response<product[]|validationErrorArray|dbErrorReturn>) {
    try {
        const resValidation = validationResult(request);
        
        if (!resValidation.isEmpty()) {
           return response.status(400).send({"Errors":resValidation.array()} );
        }
        const slug:string = request.query.slug
        const prods:product[] = await random_prods(slug,3)

        if(prods.length >0)
        {
            return response.status(200).send(prods)
        }else{
            return response.status(404).send(prods)
        }

    } catch (error) {
       
        return response.status(500).send(formatDbErrorMessage(error))
    }
}