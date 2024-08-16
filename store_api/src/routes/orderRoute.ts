import  express, {  Request, Response, Router } from "express";
import { place_order } from "../handlers/orderHandler";
const route:Router = Router()


route.post("/add",place_order)
export default route;
