const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/add",(req,res)=>{
    const usr1 = new User(req.body)
    usr1.save()  
        .then((savedUser)=>{
                res.send(savedUser)
        })
        .catch((err)=>
        {
            res.send(err)
        })
})

router.post("/create",async (req,res)=>{

    try{
        usr1 = new User(req.body)
        savedUser = await usr1.save()
        res.send(savedUser)
    }
    catch(err){
        res.send(err)
    }
})


router.get("/getall",(req,res)=>{
    User.find()
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.send(err)
    })
})

router.get("/getallasync", async (req,res)=>{
    try{
        data = await User.find()
        res.send(data)
    }
    catch(err){
        res.send(err)
    }
})

router.get("/getbyid/:id",(req,res)=>{

    User.findById(req.params.id)
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.send(err)
    })
})

router.get("/getbyidasync/:id", async (req,res)=>{
    try {
      data = await  User.findById(req.params.id)
      res.send(data)
    } catch (error) {
        res.send(error)
    }
})


router.delete("/delete/:id",(req,res)=>{
    User.findOneAndDelete({_id : req.params.id})
    .then((val)=>{
        res.send(val)
    })
    .catch((err)=>{
        res.send(err)
    })
})
router.delete("/deleteasync/:id", async (req,res)=>{

    try {
        data = await User.findByIdAndDelete(req.params.id)
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})


router.put("/update/:id",(req,res)=>{
    id = req.params.id
    newData = req.body
    User.findByIdAndUpdate({_id:id},newData)
    .then((updatedUser)=>{
        res.send(updatedUser)
    })
    .catch((err)=>{
        res.send(err)
    })

})
 

module.exports = router;