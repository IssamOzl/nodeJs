const express = require("express");
const app = express();
const productRoute = require("./routes/products")
const userRoute = require("./routes/user.js")
const {limitReqs} = require("./handlers/limiter.js")
require('dotenv').config()
const PORT = process.env.SERVER_PORT || 3000
const {connectToDb,pool} = require("./db/conn")
// enable json data
app.use(express.json())

// app routes
//app.use(limitReqs)
app.use("/product",productRoute)
app.use("/user",userRoute)
connectToDb()
    .then(()=>{
         app.listen(PORT,()=>{
            console.log("Listening on PORT ",PORT)
        })
    })
    .catch((error)=>{console.log(error);process.exit(0);})
   
