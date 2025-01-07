const rideController = require("../controllers/RideController");

module.exports = (app) => {
  // Create a new ride
  app.post("/rides/create", rideController.createRide);

  // Update a ride
  app.patch("/rides/update/:rideId", rideController.updateRide);

  // Delete a ride
  app.delete("/rides/delete/:rideId", rideController.deleteRide);

  // Get all rides
  app.get("/rides/all", rideController.getRides);

  // Get a single ride by ID
  app.get("/rides/:rideId", rideController.getRideById);

  // Join a ride as a passenger
  app.post("/rides/join/:rideId", rideController.joinRide);

  // Leave a ride as a passenger
  app.post("/rides/leave/:rideId", rideController.leaveRide);

  // Get rides published by a specific user
  app.get("/rides/user/:userId", rideController.getRidesByUser);
};