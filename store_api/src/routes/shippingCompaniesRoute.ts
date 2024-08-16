import  express, {  Request, response, Response, Router } from "express";
import { get_active_shipping_companies, get_default_shipping_company } from "../handlers/shippingCompanyHandlers";
const router:Router = Router()

router.get("/",get_active_shipping_companies)
router.get("/default_company",get_default_shipping_company)

export default  router;