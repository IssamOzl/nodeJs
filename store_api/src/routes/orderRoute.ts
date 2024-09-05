import  express, {  Request, Response, Router } from "express";
import { place_order,place_order_validation } from "../handlers/orderHandler";
import { placeOrderlimiter } from "../handlers/rateLimiter";
const route:Router = Router()

/**
 * @swagger
 * tags:
 *   name: orders
 *   description: API endpoint to manage orders.
 */

/**
 * @swagger
 *   /orders/add:
 *     post:
 *       summary: Add an order.
 *       tags: [orders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/order'
 *       responses:
 *         "500":
 *           $ref: '#/components/responses/500'       
 *         "400":
 *           $ref: '#/components/responses/400'       
 *         "201":
 *           $ref: '#/components/responses/201'    
 */
route.post("/add",placeOrderlimiter, place_order_validation,place_order)
export default route;
