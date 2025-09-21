const express = require('express');
const { validateSignupData } = require('../utils/validations');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post("/signup", async (req, res) => {
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

router.post("/login", async (req, res) => {
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


module.exports = router;
