const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender skills bio"
    ); // can also write ["firstName", "lastName", "photoUrl"]
    res.json({
      message: "Connection requests retrieved successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

router.get("/user/connection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstName lastName photoUrl age gender skills bio"
      )
      .populate(
        "toUserId",
        "firstName lastName photoUrl age gender skills bio"
      );
    const data = connections.map((row) => row.fromUserId);
    res.json({
      message: "User connections retrieved successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

module.exports = router;
