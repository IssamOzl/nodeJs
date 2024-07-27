const express = require("express");
const app = express();
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");

require("./config/connect")


app.use(express.json());
app.use("/product",productRoute)
app.use("/user",userRoute)

app.listen(3000,()=>{
    console.log("server work")
})