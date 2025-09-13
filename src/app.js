const express = require('express');
const connectDB = require('./config/database');

const app = express();
const {userAuth} = require('./models/user');
const User = require('./models/user');

app.post("/signup", async(req, res )=>{
    const userObj = {
        firstName : "Shivam",
        lastName : "Kumar",
        emailId : "shivam.kumar@example.com",
        password : "password123",
        age : "24",
        gender : "Male"
    }
    const user= new User(userObj);
    try{
        await user.save();
        res.status(200).send(user);
    }catch(err){
        res.status(500).send("Internal Server Error");
    }
})

connectDB().then(()=>{
    console.log("DB connected");
    app.listen(3000, ()=>{
    console.log("Running on server 3000");
});
}).catch((err)=>{
    console.error("DB connection error", err);
})



