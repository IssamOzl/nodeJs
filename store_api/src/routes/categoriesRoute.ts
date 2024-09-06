import  express, {  Request, Response, Router } from "express";
import { getCategories ,getActiveCategories} from "../handlers/categoriesHandlers";

const route:Router = Router()

/**
 * @swagger
 * tags:
 *   name: categories
 *   description: API endpoint to get categories.
 */

/**
 * @swagger
 *   /categories:
 *     get:
 *       summary: Get all categories of the products (active and also non active once)
 *       tags: [categories]
 *       responses:
 *         "200":
 *           description: The list of categories.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/category'
 *         "404":
 *           description: No categories found.    
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/category'
 *         "500":
 *           $ref: '#/components/responses/500'       
 */
route.get("/",getCategories)
/**
 * @swagger
 *   /categories/active:
 *     get:
 *       summary: Get all active product categories.
 *       tags: [categories]
 *       responses:
 *         "200":
 *           description: The list of active categories.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/category'
 *         "404":
 *           description: No categories found.    
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/category'
 *         "500":
 *           $ref: '#/components/responses/500'       
 */
route.get("/active",getActiveCategories)

export default route;
