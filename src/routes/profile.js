const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid updates");
    }
    const updatedData = Object.keys(req.body);
    const user = req.user;
    updatedData.forEach((key) => (user[key] = req.body[key]));
    await user.save();
    res.json({
      message: `${user.firstName} profile updated successfully`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!currentPassword || !newPassword) {
      return res.status(400).send("Current and new password are required.");
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).send("Current password is incorrect.");
    }
    // Example password validation: at least 8 chars, 1 number, 1 letter
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const isPasswordValid = await user.validatePassword(newPassword);
    // !passwordRegex.test(newPassword) or !isPasswordValid
    if (!isPasswordValid) {
      return res
        .status(400)
        .send(
          "New password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol."
        );
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = router;
