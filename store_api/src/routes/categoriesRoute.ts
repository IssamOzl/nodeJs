import  express, {  Request, Response, Router } from "express";
import { getCategories ,getActiveCategories} from "../handlers/categoriesHandlers";

const route:Router = Router()

route.get("/",getCategories)
route.get("/active",getActiveCategories)

export default route;
