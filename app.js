const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Piyushlovescode";

const app = express();
app.use(express.json());

const users = []; 

function loggermiddleware(req,res,next){
    console.log(req.method + " request came ");
    next();
}

function authmiddleware(req,res,next){
    const token =req.headers.token;
    const decodeddata= jwt.verify(token,JWT_SECRET);

    if(decodeddata){
        req.name = decodeddata.name; 
        next();
    }else{
        res.send("you're not authorised ");
    }
}


app.post('/signup',loggermiddleware,(req,res)=>{
    const name = req.body.name;
    const pin = req.body.pin;

    users.push({
        "name":name,
        "pin": pin
    })
    res.send("you're logged in!");
    console.log(users);
})


app.post('/signin',loggermiddleware,(req,res)=>{
    const name = req.body.name;
    const pin = req.body.pin;
    let userfound = false;

    if(users.find(u=>u.name==name&&u.pin==pin)){
        const token = jwt.sign({name},JWT_SECRET);
        res.json({
            token:token
        })
        
    }else{
        res.json({
            message:"not authorised"
        })
    }


})


app.get('/me',loggermiddleware, authmiddleware,(req,res)=>{
    
    let userfound = null;

    for(let i =0;i<users.length;i++){
        if(users[i].name===req.name){
            userfound = users[i];
            break;
        }
    }
    if(userfound){
        res.json({
            "name":userfound.name,
            "password":userfound.pin

        })
    }else{
        res.json({
            message:"you're not authorised "
        })
    }
})

app.listen(3000, () => {
    console.log("server is openß")
});