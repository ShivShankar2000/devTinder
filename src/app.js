const express = require('express');

const app = express();
const {userAuth, adminAuth} = require('./middlewares/auth');
app.use("/user", userAuth);

app.get("/user",(req, res , next)=>{
    console.log(req.query , req.params);
    res.send({name: "Shiv", age: 24, city: "Kolkata"})
})

app.get("/admin", adminAuth,(req, res , next)=>{
    console.log(req.query , req.params);
    res.send("Admin route")
})

app.get("/admin/:id", adminAuth,(req, res , next)=>{
    console.log(req.query , req.params);
    res.send("Admin route with ID "+ req.params.id)
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



