const express = require('express');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const { userAuth } = require('./middlewares/auth');
const { validateSignupData } = require('./utils/validations');
const User = require('./models/user');
const { use } = require('react');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, emailId, password: passwordHash });
        await user.save();
        res.status(200).send(user + " is saved successfully");
    } catch (err) {
        res.status(400).send("Error saving the user" + err.message);
    }
})

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
            res.cookie('token', token, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: true });
            res.status(200).send("Login successful");
        } else {    
            throw new Error("Invalid credentials");
        }
        
    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }
})  

app.get("/profile", userAuth , async (req, res) => {
   try {
       const user = req.user;

       res.status(200).send(user);
   } catch (err) {
       res.status(400).send("Error :" + err.message);
   }
})

app.get("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;
    res.status(200).send(user.firstName + " sent the connection request!");
});

connectDB().then(() => {
    console.log("DB connected");
    app.listen(3000, () => {
        console.log("Running on server 3000");
    });
}).catch((err) => {
    console.error("DB connection error", err);
})



