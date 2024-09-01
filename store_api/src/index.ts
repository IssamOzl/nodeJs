import express, { Request, Response } from 'express'
import dotenv from 'dotenv';
import { connectToDb, pool } from "./db/conn";
import paramsRoute from "./routes/paramsRoute"
import categoriesRoute from "./routes/categoriesRoute"
import productsRoute from "./routes/productsRoute"
import usersRoute from "./routes/usersRoute"
import ordersRoute from "./routes/orderRoute"
import shippingCityRoute from "./routes/shippingCitiesRoute"
import shippingCompaniesRoute from "./routes/shippingCompaniesRoute"
import {validateApiKey, validateApiKeyValidation} from "./handlers/apiKeyHandlers";
import {limiter} from "./handlers/rateLimiter"
import { format, transports } from 'winston';
import {logger, myErrorLogger} from "./handlers/logger"
import { error } from 'console';

var winston = require('winston'),
    expressWinston = require('express-winston');

dotenv.config();
const app = express()
const PORT:number = Number(process.env.SERVER_PORT) || 3000


app.use(express.json())

// rate limiter by ip adress
app.use(limiter)

// logger


app.use(expressWinston.logger({
    winstonInstance: logger,
    statusLevels:true
}))
expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

// validate API key
app.use(validateApiKeyValidation,validateApiKey)
// routes
app.use("/api/v1/params",paramsRoute)
app.use("/api/v1/categories",categoriesRoute)
app.use("/api/v1/products",productsRoute)
app.use("/api/v1/users/",usersRoute)
app.use("/api/v1/shipping_companies/",shippingCompaniesRoute)
app.use("/api/v1/orders/",ordersRoute)
app.use("/api/v1/shipping_cities/",shippingCityRoute)


// error formating
app.use(expressWinston.errorLogger({
winstonInstance:myErrorLogger
}))


connectToDb()
    .then(()=>{
         app.listen(PORT,()=>{
            console.log("Listening on PORT ",PORT)
        })
    })
    .catch((error:Error)=>{console.log(error);process.exit(0);})
