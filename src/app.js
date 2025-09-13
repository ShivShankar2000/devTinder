const express = require('express');

const app = express();
const {userAuth, adminAuth} = require('./middlewares/auth');
app.use("/user", userAuth);

app.get("/user",(req, res )=>{
    console.log(req.query , req.params);
    res.send({name: "Shiv", age: 24, city: "Kolkata"})
})

app.get("/admin", adminAuth,(req, res)=>{
    throw new Error("Some error")
})

app.get("/admin/:id",(req, res , next)=>{
    console.log(req.query , req.params);
    res.send("Admin route with ID "+ req.params.id)
})

app.use("/",(err, req, res, next)=>{
    if(err) {
    res.status(500).send("Something went wrong!")
    }
})

app.listen(3000, ()=>{
    console.log("Running on port 3000")
});



