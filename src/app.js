const express = require('express');

const app = express();


app.get("/user/:userId",(req, res)=>{
    console.log(req.query , req.params);
    
    res.send({name: "Shiv", age: 24, city: "Kolkata"})
})

app.post("/user",(req, res)=>{
    res.send({status: "User created successfully", userId: 1, name: "Shiv", age: 24, city: "Kolkata"})
})

app.delete("/user",(req, res)=>{
    res.send({status: "User deleted successfully", userId: 1})
})

// app.use("/test",(req, res)=>{
//     res.send("Test route...")
// })

// app.use("/",(req, res)=>{
//     res.send("Namaste Shiv...")
// })

app.listen(3000, ()=>{
    console.log("Running on port 3000")
});



