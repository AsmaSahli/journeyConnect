import React, { useState } from "react";
import { Card, Alert, Button } from "flowbite-react";
import PublishRideForm from "../components/PublishRideForm";

const PublishRidePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" or "failure"

  const handlePublishRide = async (rideData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/rides/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rideData),
      });

      if (!response.ok) {
        throw new Error("Failed to publish ride");
      }

      const data = await response.json();
      setAlertMessage("Ride published successfully!");
      setAlertType("success");
    } catch (error) {
      console.error("Error publishing ride:", error);
      setAlertMessage("Failed to publish ride. Please try again.");
      setAlertType("failure");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-xl rounded-lg">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Publish a Ride
            </h1>
            <p className="text-lg text-gray-600">
              Share your journey and connect with others!
            </p>
          </div>

          {/* Alert Section */}
          {alertMessage && (
            <Alert
              color={alertType === "success" ? "success" : "failure"}
              onDismiss={() => setAlertMessage("")}
              className="mb-6"
            >
              {alertMessage}
            </Alert>
          )}

          {/* Form Section */}
          <PublishRideForm onSubmit={handlePublishRide} isSubmitting={isSubmitting} />

          {/* Back Button */}
          <div className="mt-6 text-center">
            <Button
              color="light"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PublishRidePage;