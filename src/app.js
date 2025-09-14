const express = require('express');
const connectDB = require('./config/database');

const app = express();
const {userAuth} = require('./models/user');
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async(req, res )=>{
    const user= new User(req.body);
    try{
        await user.save();
        res.status(200).send(user + " is saved successfully");
    }catch(err){
        res.status(400).send("Error saving the user"  + err.message );
    }
})

app.get("/user", async(req, res )=>{
        const useEmail = req.body.emailId;
    try{
       const user = await User.findOne({emailId: useEmail});
        if(!user){  
            res.status(404).send("User not found");
        }else{
            res.status(200).send(user);
        }
    }catch(err){
        res.status(400).send("Cannot find user");
    }
})

app.get("/feed", async(req, res )=>{
    try{
        const user = await User.find();
        res.status(200).send(user);
    }catch(err){
        res.status(400).send("Something went wrong");
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



