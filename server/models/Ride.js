const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Driver is required"],
        },
        pickupAddress: {
            type: String,
            required: [true, "Pickup address is required"],
            trim: true,
            maxlength: [200, "Pickup address cannot exceed 200 characters"],
        },
        dropoffAddress: {
            type: String,
            required: [true, "Drop-off address is required"],
            trim: true,
            maxlength: [200, "Drop-off address cannot exceed 200 characters"],
        },
        route: {
            type: String,
            trim: true,
            maxlength: [500, "Route description cannot exceed 500 characters"],
        },
        departureDate: {
            type: Date,
            required: [true, "Departure date is required"],
            validate: {
                validator: function (value) {
                    // Ensure the departure date is not in the past
                    return value >= new Date();
                },
                message: "Departure date cannot be in the past",
            },
        },
        departureTime: {
            type: String,
            required: [true, "Departure time is required"],
            match: [
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Matches HH:MM format
                "Please enter a valid time in HH:MM format",
            ],
        },
        seats: {
            type: Number,
            required: [true, "Number of seats is required"],
            min: [1, "At least 1 seat must be available"],
            max: [10, "Maximum of 10 seats allowed"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        comment: {
            type: String,
            maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        passengers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Indexes for faster queries
RideSchema.index({ pickupAddress: "text", dropoffAddress: "text", route: "text" });

const Ride = mongoose.model("Ride", RideSchema);

module.exports = Ride;