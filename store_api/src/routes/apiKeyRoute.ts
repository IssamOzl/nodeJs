import  express, {  Request, Response, Router } from "express";
import {validateApiKey} from '../handlers/apiKeyHandlers' 

const route:Router = Router()

route.get("/",validateApiKey) 

export default route;
