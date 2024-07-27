const express = require("express");
const { createUser } = require("../handlers/user");
const router = express.Router();

router.post("/create",createUser)


module.exports = router;