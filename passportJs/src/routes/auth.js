const express = require("express");
const User = require("../models/User");
const route = express();
const { hashedPassword,checkUserNameAndPass,checkPassword  } = require("../utils/helper")
const passport = require("passport") 

route.post("/addaccount",
   async (req,res)=>{
    let status_code = 201
    let return_message = null
        const {email,password} = req.body
        if(email && password)
        {
            try 
            {
                const usr = await User.findOne({"email":email}).exec()         
                // email used 
                if(usr)
                {
                    status_code = 400
                    return_message = "Email already exist"
                }
                else
                {
                    const new_pass = hashedPassword(password)
                    const usr = new User({email:email,password : new_pass})
                    try {
                        const savedUser = await usr.save()
                        status_code = 201
                        return_message =savedUser
                    } catch (error) {
                        
                        status_code = 400
                        return_message =err
                    }
                }
            } catch (err) {
                status_code = 400
                return_message =err
            }
            
        }
        else
        {
            status_code = 400
            return_message = "invalide data"
        }
        res.status(status_code).send(return_message)

    }
)

route.post("/log",passport.authenticate("local"),(req,res)=>{
    res.send(200)
})

// route.post("/log",
//     async (req,res)=>
//     {
         
//         const user_session = req.session.user
//         let stat_code
//         let ret_message
//         let userName
//         let pass
//         [stat_code,ret_message,userName,pass] = checkUserNameAndPass(req.body)
//         // valide username and password passed to the function
//         if(stat_code == 200)
//         {
//             // check if email exist
//             try 
//             {
//                 const usr = await User.findOne({email:userName})
//                 if(usr)
//                 {
//                     // check password
//                     const {isOk,msg}= checkPassword(pass,usr.password)
                   
//                     if(isOk)
//                     {
//                         // set session cookie
//                         req.session.user = {usr}
//                         stat_code = 200
//                         ret_message = "Authorizerd"
//                     }
//                     else
//                     {

//                         stat_code = 400
//                         ret_message = "Inauthorizerd"
//                     }
//                 }
//                 else
//                 {
//                     stat_code = 400
//                     ret_message = "Invalide email or password"
//                 }
//             } catch (error) {
                
//                 stat_code = 400
//                 ret_message = error
//             }
//         }
//         res.status(stat_code).send(ret_message)
//     }
// )


route.post("/",
    (req,res)=>{
        const {user,pass} = req.body

        if(user && pass){
            const sess = req.session.user
            if(sess){
                res.status(200).send("Authorizerd")
            }else{

                user_session = {user}
                res.status(201).send("Created")
            }

        }else{
            res.send(401)
        }
    }
)

module.exports = route;