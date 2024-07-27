const passport = require("passport")
const {Strategy} = require("passport-local")
const User = require("../models/User");
const { hashedPassword,checkUserNameAndPass,checkPassword  } = require("../utils/helper")


passport.serializeUser((usr,done)=>{
    console.log("User serilised "+usr.id)
    done(null,usr.id)
})
passport.deserializeUser(async (id,done)=>{
    let isOk = false 
   
     try {
       const user = await User.findById(id)
        console.log("the id from deserializeUser =>"+user.id)
        if (user){
            isOk = true
            console.log("user deserliazed")
            done(null,user)
        }else{
            throw new Error("uer not found")
        }
         
     } catch (error) {
        console.log(error)
        isOk = false
        err = error
        done(err,null)
     }

})

passport.use( 
    new Strategy({
        usernameField:'email',
    },async (email,password,done)=>{
        try {
            
            if(!email || !password)
            {
                done(new Error(),null)
            }

            const usr = await User.findOne({email:email})
            if(usr)
            {
                // check password
                const {isOk,msg}= checkPassword(password,usr.password)
                
                if(isOk)
                {
                    done(null,usr)
                }
                else
                {
                    console.log("wrong")
                    done(null,null)
                }
            }
            else
            {
                done(new Error(),null) 
            }
        } catch (error) {
            done(error,null)
        }
        
         
    })
)