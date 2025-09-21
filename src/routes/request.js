const express = require('express');
const { userAuth } = require('../middlewares/auth');

const router = express.Router();

router.get("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;
    res.status(200).send(user.firstName + " sent the connection request!");
});

module.exports = router;
