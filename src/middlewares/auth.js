const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        const decoded = await jwt.verify(token, 'your_jwt_secret');
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized: " + err.message);
    }
}

module.exports = { userAuth }