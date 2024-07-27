const { pool } = require("./conn");


const find = async ()=>{
    const QUERY = "select * from products order by id"
    try {
        const client = await pool.getConnection()
        const res = await client.query(QUERY)
        client.release();
        return res[0]
    } catch (error) {
        console.log("error occured find() ",error)
        throw new error(error)
    }
}

const findById = async (id)=>{
    const QUERY = "select * from products where id = ?"
    try {
        const client = await pool.getConnection()
        const res = await client.query(QUERY,[id])
        client.release();
        return res[0]
    } catch (error) {
        console.log("error occured findById() ",error)
        throw new error(error)
    }
}

const createProd= async (name,desc)=>{
    const QUERY = "insert into products (name,description) values (?,?)"
    try {
        const client = await pool.getConnection()
        const res = await client.query(QUERY,[name,desc])
        client.release();
        return res
    } catch (error) {
        console.log("error occured createProd() ",error)
        throw new error(error)
    }
}

const updateProd = async (name,desc,id)=>{
    const QUERY = "update products set name = ? , description = ? where id=?"
    try {
        const client = await pool.getConnection()
        const res = await client.query(QUERY,[name,desc,id])
        client.release();
        return res[0]
    } catch (error) {
        console.log("error occured updateProd() ",error)
        throw new error(error)
    }
}

const deleteProd = async (id)=>{
    const QUERY = "delete from products where id=?"
    try {
        const client = await pool.getConnection()
        const res = await client.query(QUERY,[id])
        client.release();
        return res[0]
    } catch (error) {
        console.log("error occured deleteProd() ",error)
        throw new error(error)
    }
}

module.exports = {
    find,
    findById,
    createProd,
    updateProd,deleteProd
}