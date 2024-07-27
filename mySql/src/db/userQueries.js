const { json } = require("express");
const { hashedPassword } = require("../utils/helper");
const { pool } = require("./conn");
const { genApiKey } = require("../handlers/apiKey");

const checkEmailExist = async (email)=>{

    try {
        const QUERY = "select count (*) as email_count from user where email = ?"
        const client = await pool.getConnection()
        const res = await client.query(QUERY,[email])
     
        client.release();
        return res[0][0]
    } catch (err) {
        console.log("error occured find() ",err)
        throw new Error(err)
    }
    
}
const create = async (email,password,host)=>{
    try {
        const hashedPass = hashedPassword(password)
        const [key,hashedKey] = await genApiKey()
        console.log("API KEYyyyyyyyyyyyyy ==>",hashedKey)
        const usage_date = new Date().toISOString().split("T")[0]
        const usage_count = 0
        const QUERY = "insert into user (email,password,host,api_key,usage_date,usage_count) values (?,?,?,?,?,?)"
        const client = await pool.getConnection()
        const res = client.query(QUERY,[email,hashedPass,host,hashedKey,usage_date,usage_count])
        client.release();
        return res;
    } catch (error) {
        console.log("error occured create() ",err)
        throw new Error(err)
    }
}

module.exports = {
    checkEmailExist,
    create 
}