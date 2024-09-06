import  express, {  Request, response, Response, Router } from "express";
import { get_active_shipping_cities,get_shipping_city_details, get_shipping_city_details_validation } from "../handlers/ShipingCityHandlers";
import { shipping_city_details } from "../db/shippingCityQueries";
const router:Router = Router()

/**
 * @swagger
 * tags:
 *   name: shipping cities
 *   description: API endpoint to get available shipping cities.
 */
 
/**
 * @swagger
 *   /shipping_cities:
 *     get:
 *       summary: Retrieve all the shipping cities available.
 *       tags: [shipping cities]
 *       responses:
 *         "200":
 *           description: The list of shipping cities.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/shippingCity'
 *         "500":
 *           $ref: '#/components/responses/500'
 *         "404":
 *           $ref: '#/components/responses/404'      
 */
router.get("/",get_active_shipping_cities)

/**
 * @swagger
 *   /shipping_cities/shipping_city_details:
 *     get:
 *       summary: Retrieve the shipping city details based on the id.
 *       tags: [shipping cities]
 *       parameters:
 *         - in: query
 *           name: id
 *           type: number
 *           required: true
 *           description: The shipping city id, must be a positive integer >=1.
 *       responses:
 *         "200":
 *           description: The details of the shipping city.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/shippingCity'
 *         "500":
 *           $ref: '#/components/responses/500'
 *         "404":
 *           $ref: '#/components/responses/404' 
 *         "400":
 *           $ref: '#/components/responses/400'     
 */
router.get("/shipping_city_details",get_shipping_city_details_validation, get_shipping_city_details)

export default  router;