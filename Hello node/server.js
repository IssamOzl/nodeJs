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

// const express = require('express');
// const { query, validationResult } = require('express-validator');
// const app = express();

// app.use(express.json());
// app.get('/hello', query('person').notEmpty(), (req, res) => {
//   const result = validationResult(req);
//   if (result.isEmpty()) {
//     return res.send(`Hello, ${req.query.person}!`);
//   }

//   res.send({ errors: result.array() });
// });

// app.listen(3000);

