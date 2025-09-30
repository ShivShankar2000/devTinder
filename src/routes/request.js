const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { status, toUserId } = req.params;

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ error: "Recipient user not found" });
    }

    // if (fromUserId.toString() === toUserId) {
    //   return res
    //     .status(400)
    //     .json({ error: "Cannot send connection request to yourself" });
    // }

    const validStatuses = ["ignored", "interested"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { toUserId, fromUserId },
        { toUserId: fromUserId, fromUserId: toUserId },
      ],
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ error: "Connection request already exists" });
    }

    const connectionRequest = new ConnectionRequest({
      toUserId,
      fromUserId,
      status,
    });
    const data = await connectionRequest.save();

    res.json({
      message:
        status === "interested"
          ? `Connection request sent successfully`
          : `Connection request updated successfully`,
      data,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

router.post(
  "/request/respond/:status/:fromUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const { status, fromUserId } = req.params;
      const validStatuses = ["accepted", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: fromUserId,
        toUserId: user._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(404).json({ error: "Connection request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message:
          status === "accepted"
            ? "Connection request accepted successfully"
            : "Connection request rejected successfully",
        data,
      });
    } catch (error) {
      res.status(400).send("Error :" + error.message);
    }
  }
);

module.exports = router;
