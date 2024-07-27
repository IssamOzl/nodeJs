const { pool } = require("./conn");


const find = async (api_key)=>{
    const QUERY = "select count(*) as count_keys from user where api_key = ?"
    try {
        const client = await pool.getConnection()
        const res = await client.query(QUERY,[api_key])
       
        client.release();
        return res[0][0]
    } catch (error) {
        console.log("error occured find() ",error)
        throw new error(error)
    }
}
const findByCryptedKey= async (crypted_key)=>{
    console.log("findByCryptedKey =====");
    console.log("crypted_key => ",crypted_key);
    console.log("HERE 1 ",crypted_key)
    const QUERY = "select usage_date,usage_count,host  from user where api_key = ?"
    console.log("HERE 2")
    try {
        console.log("HERE 3")
        const client = await pool.getConnection()
        console.log("HERE 4 ")
        const resQ = await client.query(QUERY,[crypted_key])
        console.log("res => ",resQ);
        client.release();
        return resQ[0][0]
    } catch (error) {
        console.log("error occured find() ",error)
        throw new error(error)
    }
}
const updateUsageCount = async (crypted_key,to_zero)=>{
    let QUERY 
    if(!to_zero) {
        QUERY= "update user set usage_count = (usage_count+1), usage_date = ? where api_key = ? "
    }else{
        QUERY= "update user set usage_count = 1, usage_date = ? where api_key = ? "
    }
    try {
        const client = await pool.getConnection()
        const tod = new Date().toISOString().split('T')[0];
        
        const res = await client.query(QUERY,[tod,String(crypted_key)])
        client.release();
        return res
    } catch (error) {
        console.log("error occured find() ",error)
        throw new error(error)
    }
}
module.exports = {
    find,
    findByCryptedKey,
    updateUsageCount
}