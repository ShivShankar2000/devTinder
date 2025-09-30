const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
    const data = connections.map((row) => {
      return row.fromUserId._id.equals(user._id)
        ? row.toUserId
        : row.fromUserId;
    });
    res.json({
      message: "User connections retrieved successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

router.get("/user/feeds", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // Max limit is 50
    const skip = (page - 1) * limit;

    // Find all users the current user is connected to
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
      .select("fromUserId toUserId")
      .skip(skip)
      .limit(limit);
    const hideUsersFomFeeds = new Set();
    connections.forEach((conn) => {
      hideUsersFomFeeds.add(conn.fromUserId.toString());
      hideUsersFomFeeds.add(conn.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $ne: userId } }, // Exclude the current user
        { _id: { $nin: Array.from(hideUsersFomFeeds) } }, // Exclude connected users
      ],
    }).select("firstName lastName photoUrl age gender skills bio");

    res.json({
      message: "User feeds retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

module.exports = router;
