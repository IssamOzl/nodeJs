import  {  Request, Response, Router } from "express";
import { getCategories ,getActiveCategories, getCategoryDetails, getCategoryDetails_validation} from "../handlers/categoriesHandlers";

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

/**
 * @swagger
 *   /categories/details:
 *     get:
 *       summary: Get details of category by it's id.
 *       tags: [categories]
 *       responses:
 *         "200":
 *           description: The category details.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/category'
 *         "404":
 *           description: No category found.    
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/category'
 *         "500":
 *           $ref: '#/components/responses/500'       
 */
route.get("/details",getCategoryDetails_validation, getCategoryDetails)

export default route;
