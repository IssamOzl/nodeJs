const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { param,query, validationResult, header } = require("express-validator");

router.post("/addproduct",(req,res)=>{
    const prd = new Product(req.body)
    prd.save()  
        .then((savedPrd)=>{
                res.send(savedPrd)
        })
        .catch((err)=>
        {
            res.send(err)
        })
})


router.get("/getallproducts",(req,res)=>{
	Product.find()
	.then(
		(data)=>{
			res.status(200).send(data)
		}
	)
	.catch(
		(err)=>{
			res.status(400).send(err)
		}
	)
})

router.get("/getproductbyid/:id/:tst",
        
            [param("id")
                .isInt().withMessage("ID must be int"),
            param("tst")
                .isInt().withMessage("tst must be int")]
    
    ,(req,res)=>{
        const result = validationResult(req);
        if (result.isEmpty()) {
            console.log("EMpty");
        }
        else
        { 
            res.send({ errors: result.array() });
        }
    
})

router.delete("/deleteproduct/:id",(req,res)=>{
    Product.findOneAndDelete({_id : req.params.id})
    .then((val)=>{
        res.status(200).send(val)
    })
    .catch((err)=>{
        res.status(400).send(err)
    })
})


router.put("/updateproduct/:id",(req,res)=>{
    id = req.params.id
    newData = req.body
    Product.findByIdAndUpdate({_id:id},newData)
    .then((updatedProd)=>{
        res.status(200).send(updatedProd)
    })
    .catch((err)=>{
        res.status(400).send(err)
    })

})


module.exports = router;
