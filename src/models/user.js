const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 64,
      trim: true,
      validate(value) {
        if (
          !validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
        ) {
          throw new Error("Password is not strong enough: " + value);
        }
      },
    },
    age: { type: Number, min: 18, max: 100 },
    gender: {
      type: String,
      enum: ["male", "female", "other", "Male", "Female", "Other"],
      trim: true,
      enum: {
        values: ["male", "female", "other", "Male", "Female", "Other"],
        message: `{VALUE} is not a valid gender`,
      },
      // validate(value) {
      //     if (!['male', 'female', 'other','Male','Female','Other'].includes(value)) {
      //         throw new Error('Invalid gender');
      //     }
      // }
    },
    photoUrl: {
      type: String,
      default:
        "https://imgs.search.brave.com/3SWuWnQgFhsq940CBhII9PGkgIV5tXJjcCca6NOApjE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMy/NzU5MjUwNi92ZWN0/b3IvZGVmYXVsdC1h/dmF0YXItcGhvdG8t/cGxhY2Vob2xkZXIt/aWNvbi1ncmV5LXBy/b2ZpbGUtcGljdHVy/ZS1idXNpbmVzcy1t/YW4uanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPUJwUjBGVmFF/YTVGMjRHSXc3Szhu/TVdpaUdtYmI4cW1o/ZmtwWGNwMWRoUWc9",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL: " + value);
        }
      },
    },
    bio: {
      type: String,
      maxLength: 250,
      default: "Hello! I am using DevTinder.",
    },
    skills: { type: [String] },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (currentPassword) {
  return await bcrypt.compare(currentPassword, this.password);
};

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, "your_jwt_secret", {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
