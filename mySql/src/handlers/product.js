const { find, findById, createProd, updateProd, deleteProd } = require("../db/productQueries")

const getAllProducts = async(req,res)=>{
    try {
        const products = await find()
        res.status(200).send(products)
    } catch (error) {
        res.status(500).send(error)
    }
    
}
const getProduct = (req,res)=>{
    const id = req.params.id;
    const product  = findById(id)
    .then((prod)=>{
        console.log(prod)
        res.status(200).send(prod)
    })
    .catch((error)=>{
        res.status(500).send(error)
    })
}
const createProduct = async(req,res)=>{
    const  {name,description} = req.body
    try {
        const product = await createProd(name,description)
        const insertedId = product[0].insertId
        res.status(200).send({"id":insertedId})
    } catch (error) {
        res.status(500).send(error)
    }
}
const updateProduct = async(req,res)=>{
    const id = req.params.id
    const  {name,description} = req.body
    try {
        const product = await updateProd(name,description,id) 
        res.status(200).send(product)
    } catch (error) {
        res.status(500).send(error)
    }
}
const deleteProduct = async(req,res)=>{
    const id = req.params.id
    try {
        const product = await deleteProd(id) 
        res.status(200).send(product)
    } catch (error) {
        res.status(500).send(error)
    }
}


module.exports = 
{
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}