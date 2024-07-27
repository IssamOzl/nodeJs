const mysql= require("mysql2/promise")
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.DB_HOST ,
    user:process.env.DB_USER,
    database:process.env.DB_NAME ,
    port:process.env.DB_PORT,
    password:process.env.DB_PASSWORD
})

const connectToDb = async()=>{
    try {
        
        await pool.getConnection();
        console.log("Connect to db succesfully")
    } catch (error) {
        console.log("Error while connecting to DB",error);
        throw error;
    }
}

module.exports ={pool,connectToDb} ;