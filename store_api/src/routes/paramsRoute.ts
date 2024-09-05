import  express, {  Request, Response, Router } from "express";
import {  getParams } from "../handlers/paramsHandlers"

 

const route:Router = Router()
/**
 * @swagger
 * tags:
 *   name: parameters
 *   description: API endpoint to get the front end shop parameters.
 */

/**
 * @swagger
 *   /params:
 *     get:
 *       summary: Get all the general settings of the shop.
 *       tags: [parameters]
 *       responses:
 *         "200":
 *           description: The list of parameters.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/category'
 *         "404":
 *           description: No parameters found.    
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/category'
 *         "500":
 *           $ref: '#/components/responses/500'       
 */
route.get("/",getParams)

// route.get("/getByName",getParamByName)
export default route;
