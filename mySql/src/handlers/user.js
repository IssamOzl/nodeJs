const {checkEmailExist, create} = require("../db/userQueries")

const createUser = async (req,res)=>{
    try {
    const host    = req.get('host');
    const header_api_key = req.get('x-api-key');
    const {email,password} = req.body;
    if(email && password){
        const resQuery =  await checkEmailExist(email)
        const count = JSON.stringify(resQuery.email_count)
        if (count>0){
            res.status(401).send("Email already used")
        }else{
            const created = await create(email,password,host) 
            res.status(201).json({"insertId":created[0].insertId})
        }
         
     }else{
        res.status(400).send("invalide data")
    }

        
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = {
    createUser
}