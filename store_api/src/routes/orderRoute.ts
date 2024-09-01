import  express, {  Request, Response, Router } from "express";
import { place_order,place_order_validation } from "../handlers/orderHandler";
import { placeOrderlimiter } from "../handlers/rateLimiter";
const route:Router = Router()


route.post("/add",placeOrderlimiter, place_order_validation,place_order)
export default route;
