const bcrypt = require('bcryptjs');


function hashedPassword(password)
{
    const salt = bcrypt.genSaltSync()
    return bcrypt.hashSync(password,salt)
}

function checkUserNameAndPass(reqBody)
{
    let res_status = 400
    let res_msg = "Invalide data"
    const {email,password} = reqBody
    
    if(email && password )
    {
        res_status = 200
        res_msg = "OK !"
    } 
    return [res_status,res_msg,email,password]

}

function checkPassword(usrPass,dbPass)
{
    let isOk = false
    let msg = "Incorrect password"
    console.log("HEEEERE")
    if (bcrypt.compareSync(usrPass, dbPass)) {
        msg=  "Login success"
        isOk = true
    } 
    return {isOk,msg}
}

module.exports = {hashedPassword,checkUserNameAndPass,checkPassword};