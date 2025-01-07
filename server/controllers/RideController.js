// controllers/RideController.js
const Ride = require("../models/Ride");
const e = require("../utils/error");

module.exports = {
  // Create a new ride
  createRide: async (req, res, next) => {
    const {
      driverId,
      pickupAddress,
      dropoffAddress,
      route,
      departureDate,
      departureTime,
      seats,
      price,
      comment,
    } = req.body;

    try {
      // Validate required fields
      if (
        !driverId ||
        !pickupAddress ||
        !dropoffAddress ||
        !departureDate ||
        !departureTime ||
        !seats ||
        !price
      ) {
        return next(e.errorHandler(400, "All required fields must be provided"));
      }

      // Create the ride
      const newRide = new Ride({
        driver: driverId,
        pickupAddress,
        dropoffAddress,
        route,
        departureDate,
        departureTime,
        seats,
        price,
        comment,
      });

      await newRide.save();
      res.status(201).json(newRide);
    } catch (error) {
      next(error);
    }
  },

  // Update a ride
  updateRide: async (req, res, next) => {
    const { rideId } = req.params;
    const updateData = req.body;

    try {
      // Find the ride
      const ride = await Ride.findById(rideId);
      if (!ride) {
        return next(e.errorHandler(404, "Ride not found"));
      }

      // Update the ride
      const updatedRide = await Ride.findByIdAndUpdate(rideId, updateData, {
        new: true,
      });

      res.status(200).json(updatedRide);
    } catch (error) {
      next(error);
    }
  },

  // Delete a ride
  deleteRide: async (req, res, next) => {
    const { rideId } = req.params;

    try {
      // Find the ride
      const ride = await Ride.findById(rideId);
      if (!ride) {
        return next(e.errorHandler(404, "Ride not found"));
      }

      await Ride.findByIdAndDelete(rideId);
      res.status(200).json("Ride deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  // Get all rides
  getRides: async (req, res, next) => {
    try {
      const rides = await Ride.find({ isActive: true })
        .populate("driver", "firstName lastName profilePicture")
        .populate("passengers", "firstName lastName profilePicture");

      res.status(200).json(rides);
    } catch (error) {
      next(error);
    }
  },

  // Get a single ride by ID
  getRideById: async (req, res, next) => {
    const { rideId } = req.params;

    try {
      const ride = await Ride.findById(rideId)
        .populate("driver", "firstName lastName profilePicture")
        .populate("passengers", "firstName lastName profilePicture");

      if (!ride) {
        return next(e.errorHandler(404, "Ride not found"));
      }

      res.status(200).json(ride);
    } catch (error) {
      next(error);
    }
  },

  // Join a ride as a passenger
  joinRide: async (req, res, next) => {
    const { rideId } = req.params;
    const { userId } = req.body;

    try {
      // Find the ride
      const ride = await Ride.findById(rideId);
      if (!ride) {
        return next(e.errorHandler(404, "Ride not found"));
      }

      // Check if the ride is active
      if (!ride.isActive) {
        return next(e.errorHandler(400, "This ride is no longer available"));
      }

      // Check if there are available seats
      if (ride.passengers.length >= ride.seats) {
        return next(e.errorHandler(400, "No available seats"));
      }

      // Check if the user is already a passenger
      if (ride.passengers.includes(userId)) {
        return next(e.errorHandler(400, "You have already joined this ride"));
      }

      // Add the user as a passenger
      ride.passengers.push(userId);
      await ride.save();

      res.status(200).json("You have successfully joined the ride");
    } catch (error) {
      next(error);
    }
  },

  // Leave a ride as a passenger
  leaveRide: async (req, res, next) => {
    const { rideId } = req.params;
    const { userId } = req.body;

    try {
      // Find the ride
      const ride = await Ride.findById(rideId);
      if (!ride) {
        return next(e.errorHandler(404, "Ride not found"));
      }

      // Check if the user is a passenger
      if (!ride.passengers.includes(userId)) {
        return next(e.errorHandler(400, "You are not a passenger in this ride"));
      }

      // Remove the user from the passengers list
      ride.passengers = ride.passengers.filter(
        (passenger) => passenger.toString() !== userId
      );
      await ride.save();

      res.status(200).json("You have successfully left the ride");
    } catch (error) {
      next(error);
    }
  },

  // Get rides published by a specific user
  getRidesByUser: async (req, res, next) => {
    const { userId } = req.params;

    try {
      const rides = await Ride.find({ driver: userId })
        .populate("driver", "firstName lastName profilePicture")
        .populate("passengers", "firstName lastName profilePicture");

      res.status(200).json(rides);
    } catch (error) {
      next(error);
    }
  },
};