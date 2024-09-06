import  express, {  Request, response, Response, Router } from "express";
import { get_active_prods_by_category, get_all_active_prods, get_all_prods, get_all_prods_validation, get_latest_ten_prods, get_prods_by_category, get_prods_by_category_validation, get_product_details, get_product_details_validation, get_random_products } from "../handlers/productsHandlers";
import { query,validationResult } from "express-validator";
import { get_products_by_category_request, product } from "../dtos/products.dto";
import { request } from "http";


const route:Router = Router()
/**
 * @swagger
 * tags:
 *   name: products
 *   description: API endpoint to get products data.
 */
 
/**
 * @swagger
 *   /products/all_prods:
 *     get:
 *       summary: Retrieve all products, both active and inactive, without checking the number of available units, based on the specified limit and offset.
 *       tags: [products]
 *       parameters:
 *         - in: query
 *           name: limit
 *           type: number
 *           required: true
 *           description: number of proucts to get (min:1,max:60).
 *         - in: query
 *           name: offset
 *           type: number
 *           required: false
 *           description: number of proucts to skip, if not passed will be replaced by 0, but if passed must be minimum = 1 .
 *       responses:
 *         "200":
 *           description: The list of products.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/product'
 *         "500":
 *           $ref: '#/components/responses/500' 
 *         "400":
 *           $ref: '#/components/responses/400'  
 *         "404":
 *           $ref: '#/components/responses/404'      
 */
route.get("/all_prods",get_all_prods_validation,get_all_prods)
/**
 * @swagger
 *   /products/all_active_prods:
 *     get:
 *       summary: Retrieve all active products with a positive number of available units, according to the specified limit and offset.
 *       tags: [products]
 *       parameters:
 *         - in: query
 *           name: limit
 *           type: number
 *           required: true
 *           description: number of proucts to get (min:1,max:60).
 *         - in: query
 *           name: offset
 *           type: number
 *           required: false
 *           description: number of proucts to skip, if not passed will be replaced by 0, but if passed must be minimum = 1 .
 *       responses:
 *         "200":
 *           description: The list of products.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/product'
 *         "500":
 *           $ref: '#/components/responses/500' 
 *         "400":
 *           $ref: '#/components/responses/400'  
 *         "404":
 *           $ref: '#/components/responses/404'      
 */
route.get("/all_active_prods",get_all_prods_validation,get_all_active_prods)

/**
 * @swagger
 *   /products/latest_prods:
 *     get:
 *       summary: Retrieve latest 12 products added to the website.
 *       tags: [products]
 *       responses:
 *         "200":
 *           description: The list of products.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/product'
 *         "500":
 *           $ref: '#/components/responses/500' 
 *         "404":
 *           $ref: '#/components/responses/404'       
 */
route.get("/latest_prods",get_latest_ten_prods)

/**
 * @swagger
 *   /products/prods_by_category:
 *     get:
 *       summary:  Retrieve all products, both active and inactive, without checking the number of available units, based on the specified category_id,limit and offset.
 *       tags: [products]
 *       parameters:
 *         - in: query
 *           name: category_id
 *           type: number
 *           required: true
 *           description: The id of category.
 *         - in: query
 *           name: limit
 *           type: number
 *           required: true
 *           description: number of proucts to get (min:1,max:60).
 *         - in: query
 *           name: offset
 *           type: number
 *           required: false
 *           description: number of proucts to skip, if not passed will be replaced by 0, but if passed must be minimum = 1 .
 *       responses:
 *         "200":
 *           description: The list of products.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/product'
 *         "500":
 *           $ref: '#/components/responses/500' 
 *         "404":
 *           $ref: '#/components/responses/404'  
 *         "400":
 *           $ref: '#/components/responses/400'       
 */
route.get("/prods_by_category/",get_prods_by_category_validation  ,get_prods_by_category)

/**
 * @swagger
 *   /products/active_prods_by_category:
 *     get:
 *       summary: Retrieve all active products with a positive number of available units, according to the specified category_id,limit and offset.
 *       tags: [products]
 *       parameters:
 *         - in: query
 *           name: category_id
 *           type: number
 *           required: true
 *           description: The id of category.
 *         - in: query
 *           name: limit
 *           type: number
 *           required: true
 *           description: number of proucts to get (min:1,max:60).
 *         - in: query
 *           name: offset
 *           type: number
 *           required: false
 *           description: number of proucts to skip, if not passed will be replaced by 0, but if passed must be minimum = 1 .
 *       responses:
 *         "200":
 *           description: The list of products.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/product'
 *         "500":
 *           $ref: '#/components/responses/500' 
 *         "404":
 *           $ref: '#/components/responses/404'  
 *         "400":
 *           $ref: '#/components/responses/400'       
 */
route.get("/active_prods_by_category",get_prods_by_category_validation,get_active_prods_by_category)


/**
 * @swagger
 *   /products/product_details:
 *     get:
 *       summary: Retrieve product detils, according to the specified short name (slug) passed.
 *       tags: [products]
 *       parameters:
 *         - in: query
 *           name: slug
 *           type: string
 *           required: true
 *           description: The short name of the product (slug), with a minimum of 8 characters.
 *       responses:
 *         "200":
 *           description: The product details.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/product'
 *         "500":
 *           $ref: '#/components/responses/500' 
 *         "404":
 *           $ref: '#/components/responses/404'  
 *         "400":
 *           $ref: '#/components/responses/400'       
 */
route.get("/product_details",get_product_details_validation,get_product_details)

/**
 * @swagger
 *   /products/random_products:
 *     get:
 *       summary: Retrieve 3 random active products excluding the specified short name (slug).
 *       tags: [products]
 *       parameters:
 *         - in: query
 *           name: slug
 *           type: string
 *           required: true
 *           description: The short name of the product (slug), with a minimum of 8 characters.
 *       responses:
 *         "200":
 *           description: The list of products.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/product'
 *         "500":
 *           $ref: '#/components/responses/500' 
 *         "404":
 *           $ref: '#/components/responses/404'  
 *         "400":
 *           $ref: '#/components/responses/400'       
 */
route.get("/random_products",get_product_details_validation,get_random_products)

// route.get("/getByName",getParamByName)
export default route;
