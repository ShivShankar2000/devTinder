const validator = require('validator');

const validateSignupData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is required");
    }
    if (!emailId) {
        throw new Error("Email ID is required");
    }else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email address");
    } 
    if (!password) {
        throw new Error("Password is required");
    }else if (!validator.isStrongPassword(password, { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new Error("Password is not strong enough");
    }
};

module.exports = { validateSignupData };
