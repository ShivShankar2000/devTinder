const express = require('express');

const app = express();
// app.get only works for GET requests
// app.post only works for POST requests
// app.use works for all types of requests WITH any HTTP method (GET, POST, PUT, DELETE, PATCH)
app.get("/user",(req, res)=>{
    res.send({name: "Shiv", age: 24, city: "Kolkata"})
})

app.post("/user",(req, res)=>{
    res.send({status: "User created successfully", userId: 1, name: "Shiv", age: 24, city: "Kolkata"})
})

app.delete("/user",(req, res)=>{
    res.send({status: "User deleted successfully", userId: 1})
})
app.use("/test",(req, res)=>{
    res.send("Test route...")
})

app.use("/hello",(req, res)=>{
    res.send("Hello from server...")
})

app.use("/",(req, res)=>{
    res.send("Namaste Shiv...")
})

app.listen(3000, ()=>{
    console.log("Running on port 3000")
});



