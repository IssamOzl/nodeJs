const express = require("express")
const router = express.Router()


const fruits_db = [
    {
        "name":"banana",
        "qte":10
    },
    {
        "name":"orange",
        "qte":5
    }
]

// coockies
router.get("/all",
    (req,res)=>{
        console.log("hello from all")
        res.cookie("hadAll",true,{
            maxAge : 60000
        })
        res.status(200).send(fruits_db)
    }
)

router.get("/details/:name",
    (req,res)=>{
        const name = req.params.name
        const item = fruits_db.find((frt)=> frt.name === name)
        if(item != null)
        {
            
        res.status(200).send(item)

        }else{
            res.status(404).send()
        }
    }
)

// query parameters
router.get("/getbyqte",
    (req,res)=>{
        const qte = req.query.qte
        const item = fruits_db.find((frt)=> frt.qte == qte)

        if(item != null)
        {
            res.status(200).send(item)
        }
        else
        {
            res.status(404).send()
        }
    }
)
router.post("/add",
    (req,res)=>{
        const temp = req.body
        fruits_db.push(temp)  
        res.status(201).send(temp)
    }
)


// session variable
router.post("/shopping/cart/add",
    (req,res)=>{
        const {item , qte} = req.body;
        const cartItem = {item , qte};

        const cart = req.session.cart
        if (cart){

            req.session.cart.items.push(cartItem)
        }else{
            req.session.cart = {items:[cartItem]}
        }

        res.status(201).send();

    }
)

router.get("/shopping/cart/get",
    (req,res)=>{
        const {cart} = req.session
        if(cart)
        {
            res.status(200).send(cart)
        }
    }
)


module.exports = router