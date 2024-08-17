import  express, {  Request, Response, Router } from "express";
import { place_order,place_order_validation } from "../handlers/orderHandler";
const route:Router = Router()


route.post("/add",place_order_validation,place_order)
export default route;
