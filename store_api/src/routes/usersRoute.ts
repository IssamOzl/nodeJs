import  express, {  Request, Response, Router } from "express";
import { generate_api_key, generate_api_key_validation } from "../handlers/usersHandlers";
 


const route:Router = Router()
route.post("/generate_api_key",generate_api_key_validation,generate_api_key)

export default route;
