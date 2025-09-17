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
            res.status(422).send("User not found");
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

app.delete("/user", async(req, res )=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            res.status(422).send("User not found");
        }else{
            res.status(200).send("User deleted successfully");
        }
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.patch("/user/:userId", async(req, res )=>{
    const userId = req.params?.userId;
    const updatedData = req.body;
    try{
         const ALLOWED_UPDATE = ['password', 'age', 'gender', 'bio', 'photoUrl', 'skills'];
         const isUpdateAllowed = Object.keys(updatedData).every((update)=>{
        return ALLOWED_UPDATE.includes(update);
    })

    if(!isUpdateAllowed){
         throw new Error("Update not allowed");
    }
    if(updatedData?.skills?.length > 5){
        throw new Error("Skills cannot be more than 5");
    }
        const user = await User.findByIdAndUpdate(userId, updatedData, { runValidators: true, returnDocument: 'after'});
        if(!user){
            res.status(422).send("User not found");
        }else{
            res.status(200).send("User updated successfully");
        }
    }catch(err){
        res.status(400).send("Update failed :" + err.message);
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



