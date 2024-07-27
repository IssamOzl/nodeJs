const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/ecommerce")
    .then(
        ()=>{
            console.log("BDD connected")
        }
    )
    .catch(
        (err)=>{
            console.log(err)
        }
    )

    module.exports = mongoose;