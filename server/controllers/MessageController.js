const mongoose = require("mongoose");
const Message = require("../models/Message");
const e = require("../utils/error");

module.exports = {
  // Send a message
  sendMessage: async (req, res, next) => {
    const { rideId, senderId, receiverId, message } = req.body;

    try {
      // Validate required fields
      if (!rideId || !senderId || !receiverId || !message) {
        return next(e.errorHandler(400, "All fields are required"));
      }

      // Create a new message
      const newMessage = new Message({
        rideId,
        senderId,
        receiverId,
        message,
      });

      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      next(error);
    }
  },

  // Get messages for a specific ride and user
  getMessages: async (req, res, next) => {
    const { rideId, userId } = req.params;
  
    console.log("rideId:", rideId); // Debugging
    console.log("userId:", userId); // Debugging
  
    try {
      // Validate rideId and userId
      if (!rideId || !userId) {
        return next(e.errorHandler(400, "Ride ID and User ID are required"));
      }
  
      // Check if rideId and userId are valid ObjectIds
      if (!mongoose.Types.ObjectId.isValid(rideId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return next(e.errorHandler(400, "Invalid Ride ID or User ID"));
      }
  
      // Convert rideId and userId to ObjectIds using the 'new' keyword
      const rideObjectId = new mongoose.Types.ObjectId(rideId);
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      // Fetch messages for the ride and user
      const messages = await Message.find({
        rideId: rideObjectId,
        $or: [{ senderId: userObjectId }, { receiverId: userObjectId }],
      })
        .populate("senderId", "firstName lastName profilePicture")
        .populate("receiverId", "firstName lastName profilePicture");
  
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  },
  // Get all messages for a user (inbox)
  getInbox: async (req, res, next) => {
    const { userId } = req.params;

    try {
      // Validate userId
      if (!userId) {
        return next(e.errorHandler(400, "User ID is required"));
      }

      // Check if userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(e.errorHandler(400, "Invalid User ID"));
      }

      // Fetch all messages for the user
      const messages = await Message.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
        .populate("senderId", "firstName lastName profilePicture")
        .populate("receiverId", "firstName lastName profilePicture")
        .populate("rideId", "pickupAddress dropoffAddress departureDate");

      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  },
};