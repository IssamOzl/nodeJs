const express = require("express")
const app = express()
const fruitsRoute = require("./routes/fruits.js")
const fakeAuthRoute = require("./routes/auth.js")
const coockieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("passport")
const MongoStore = require("connect-mongo")

require("./utils/connect.js")
require("./strategies/local.js")

const PORT=3000

app.use(express.json())
app.use(coockieParser())
app.use(session({
    secret:"kdfhkdhfjfoeo",
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl:"mongodb://127.0.0.1/ecommerce_new",
    })
}))


// passportjs

app.use(passport.initialize())
app.use(passport.session())

// middle ware

// cookies
app.use(
    (req,res,next)=>{
        console.log(`${req.method}:${req.url}`)
        console.log('Cookies: ', req.cookies.hadAll)

        next()
    }
)

app.use("/login",fakeAuthRoute)
// login with session
// app.use((req,res,next)=>{
//     if(req.session.user)
//     {
//         next()
//     }else{
//         res.status(401).send("Unauthorized")
//     }
// })

app.use((req,res,next)=>{
    if(req.user)
    {
        console.log("THE USER => "+req.user)
        next()
    }else{
        res.status(401).send("Unauthorized")
    }
})


app.use("/fruits",fruitsRoute)

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})

