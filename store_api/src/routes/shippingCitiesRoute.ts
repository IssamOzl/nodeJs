import  express, {  Request, response, Response, Router } from "express";
import { get_active_shipping_cities,get_shipping_city_details, get_shipping_city_details_validation } from "../handlers/ShipingCityHandlers";
import { shipping_city_details } from "../db/shippingCityQueries";
const router:Router = Router()

router.get("/",get_active_shipping_cities)
router.get("/shipping_city_details",get_shipping_city_details_validation, get_shipping_city_details)

export default  router;