import  express, {  Request, response, Response, Router } from "express";
import { get_active_prods_by_category, get_all_active_prods, get_all_prods, get_latest_ten_prods, get_prods_by_category, get_prods_by_category_validation, get_product_details, get_random_products } from "../handlers/productsHandlers";
import { query,validationResult } from "express-validator";
import { get_products_by_category_request, product } from "../dtos/products.dto";
import { request } from "http";


 


const route:Router = Router()
route.get("/all_prods",get_all_prods)
route.get("/all_active_prods",get_all_active_prods)
route.get("/latest_ten_prods",get_latest_ten_prods)
route.get("/prods_by_category/",get_prods_by_category_validation  ,get_prods_by_category)
route.get("/active_prods_by_category",get_active_prods_by_category)
route.get("/product_details",get_product_details)
route.get("/random_products",get_random_products)

// route.get("/getByName",getParamByName)
export default route;
