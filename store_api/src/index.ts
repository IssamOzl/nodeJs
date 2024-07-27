import express from 'express'
import dotenv from 'dotenv';
import { connectToDb, pool } from "./db/conn";
import paramsRoute from "./routes/paramsRoute"
import categoriesRoute from "./routes/categoriesRoute"
import productsRoute from "./routes/productsRoute"

dotenv.config();
const app = express()
const PORT:number = Number(process.env.SERVER_PORT) || 3000


app.use(express.json())

// routes
app.use("/api/v1/params",paramsRoute)
app.use("/api/v1/categories",categoriesRoute)
app.use("/api/v1/products",productsRoute)


connectToDb()
    .then(()=>{
         app.listen(PORT,()=>{
            console.log("Listening on PORT ",PORT)
        })
    })
    .catch((error:Error)=>{console.log(error);process.exit(0);})
