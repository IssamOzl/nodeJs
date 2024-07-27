const express = require("express");
const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } = require("../handlers/product");
const { validateApiKey } = require("../handlers/apiKey");
const router = express.Router();

router.get("/",validateApiKey,getAllProducts)
router.get("/:id",getProduct)
router.post("/create",createProduct)
router.put("/update/:id",updateProduct)
router.delete("/delete/:id",deleteProduct)


module.exports = router;