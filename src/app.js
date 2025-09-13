const express = require('express');

const app = express();

app.use("/user",(req, res, next)=>{
    const token = "abc"
    const isAuthorized = token === "xyz"
    if(!isAuthorized){
        return res.status(401).send("Unauthorized!")
    }else{
        next()
    }
})

app.get("/user",(req, res , next)=>{
    console.log(req.query , req.params);
    res.send({name: "Shiv", age: 24, city: "Kolkata"})
})

app.post("/user",(req, res)=>{
    res.send({status: "User created successfully", userId: 1, name: "Shiv", age: 24, city: "Kolkata"})
})

app.delete("/user",(req, res)=>{
    res.send({status: "User deleted successfully", userId: 1})
})

app.listen(3000, ()=>{
    console.log("Running on port 3000")
});



