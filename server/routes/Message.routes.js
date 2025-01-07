// routes/messageRoutes.js
const messageController = require("../controllers/MessageController");

module.exports = (app) => {
  // Send a message
  app.post("/messages/send", messageController.sendMessage);

  // Get messages for a specific ride and user
  app.get("/messages/:rideId/:userId", messageController.getMessages);

  // Get all messages for a user (inbox)
  app.get("/messages/inbox/:userId", messageController.getInbox);
};