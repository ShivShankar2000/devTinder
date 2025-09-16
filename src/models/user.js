const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true, match: /.+\@.+\..+/, lowercase: true, trim: true },
    password: { type: String, required: true, minLength: 6, maxLength: 64, trim: true },
    age: { type: Number, min: 18, max: 100 },
    gender: { type: String, enum: ['male', 'female', 'other', 'Male', 'Female', 'Other'], trim: true,
        validate(value) { 
            if (!['male', 'female', 'other','Male','Female','Other'].includes(value)) { 
                throw new Error('Invalid gender'); 
            } 
        } 
    },
    photoUrl: { type: String, default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png" },
    bio: { type: String, maxLength: 250, default: "Hello! I am using DevTinder." },
    skills: { type: [String] },
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User