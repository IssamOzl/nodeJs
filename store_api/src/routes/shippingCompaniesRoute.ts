import  express, {  Request, response, Response, Router } from "express";
import { get_active_shipping_companies, get_default_shipping_company } from "../handlers/shippingCompanyHandlers";
const router:Router = Router()
/**
 * @swagger
 * tags:
 *   name: shipping comapanies
 *   description: API endpoint to get available shipping comapanies.
 */
 
 
/**
 * @swagger
 *   /shipping_companies:
 *     get:
 *       summary: Retrieve comapanies the shipping comapanies available.
 *       tags: [shipping comapanies]
 *       responses:
 *         "200":
 *           description: The list of shipping comapanies.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/shippingCompany'
 *         "500":
 *           $ref: '#/components/responses/500'
 *         "404":
 *           $ref: '#/components/responses/404'      
 */
router.get("/",get_active_shipping_companies)
 
/**
 * @swagger
 *   /shipping_companies/default_company:
 *     get:
 *       summary: Retrieve the default shipping comapany.
 *       tags: [shipping comapanies]
 *       responses:
 *         "200":
 *           description: The shipping comapany details.   
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/shippingCompany'
 *         "500":
 *           $ref: '#/components/responses/500'
 *         "404":
 *           $ref: '#/components/responses/404'      
 */
router.get("/default_company",get_default_shipping_company)

export default  router;