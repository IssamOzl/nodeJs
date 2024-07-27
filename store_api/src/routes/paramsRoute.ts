import  express, {  Request, Response, Router } from "express";
import {  getParams } from "../handlers/paramsHandlers"

 

const route:Router = Router()

route.get("/",getParams)

// route.get("/getByName",getParamByName)
export default route;
