const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validations');

const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.status(200).send(user);
    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }
})

router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid updates");
        }
        const updatedData = Object.keys(req.body);
        const user = req.user;
        updatedData.forEach((key) => user[key] = req.body[key]);
        await user.save();
        res.json({ message: `${user.firstName} profile updated successfully` , data: user});
    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }
})

module.exports = router;
