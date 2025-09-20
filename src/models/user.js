const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true, match: /.+\@.+\..+/, lowercase: true, trim: true ,validate(value) {
        if (!validator.isEmail(value)) {
            throw new Error('Invalid email address: ' + value);
        }
    }},
    password: { type: String, required: true, minLength: 6, maxLength: 64, trim: true , validate(value) {
        if (!validator.isStrongPassword(value, { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            throw new Error('Password is not strong enough: ' + value);
        }
    }   },
    age: { type: Number, min: 18, max: 100 },
    gender: { type: String, enum: ['male', 'female', 'other', 'Male', 'Female', 'Other'], trim: true,
        validate(value) { 
            if (!['male', 'female', 'other','Male','Female','Other'].includes(value)) { 
                throw new Error('Invalid gender'); 
            } 
        } 
    },
    photoUrl: { type: String, default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png", validate(value) {
        if (!validator.isURL(value)) {
            throw new Error('Invalid URL: ' + value);
        }
    } },
    bio: { type: String, maxLength: 250, default: "Hello! I am using DevTinder." },
    skills: { type: [String]},
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User