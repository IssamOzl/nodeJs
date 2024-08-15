import express from 'express'
import dotenv from 'dotenv';
import { connectToDb, pool } from "./db/conn";
import paramsRoute from "./routes/paramsRoute"
import categoriesRoute from "./routes/categoriesRoute"
import productsRoute from "./routes/productsRoute"
import usersRoute from "./routes/usersRoute"
import {validateApiKey, validateApiKeyValidation} from "./handlers/apiKeyHandlers";

dotenv.config();
const app = express()
const PORT:number = Number(process.env.SERVER_PORT) || 3000


app.use(express.json())

// validate API key
app.use(validateApiKeyValidation,validateApiKey)
// routes
app.use("/api/v1/params",paramsRoute)
app.use("/api/v1/categories",categoriesRoute)
app.use("/api/v1/products",productsRoute)
app.use("/api/v1/users/",usersRoute)


connectToDb()
    .then(()=>{
         app.listen(PORT,()=>{
            console.log("Listening on PORT ",PORT)
        })
    })
    .catch((error:Error)=>{console.log(error);process.exit(0);})
