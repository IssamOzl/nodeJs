import mysql, { Pool, PoolOptions,ConnectionOptions  } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const access: PoolOptions = {
    host: process.env.DB_HOST ,
    user:process.env.DB_USER,
    database:process.env.DB_NAME ,
    port:Number(process.env.DB_PORT),
    password:process.env.DB_PASSWORD
  };

  export const pool:Pool = mysql.createPool(access);

  export const connectToDb = async()=>{
    try {
        await pool.getConnection();
        console.log("Connect to db succesfully")
    } catch (error) {
        console.log("Error while connecting to DB",error);
        throw error;
    }
}
