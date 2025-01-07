import React, { useState, useRef, useEffect } from "react";
import { Button, TextInput, Label, Textarea, Alert } from "flowbite-react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useSelector } from "react-redux";

const libraries = ["places"]; // Load the Places library for autocomplete

const PublishRideForm = ({ onSubmit, isSubmitting }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [route, setRoute] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [seats, setSeats] = useState(1);
  const [price, setPrice] = useState(0);
  const [comment, setComment] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [validationError, setValidationError] = useState("");

  // Refs for autocomplete inputs
  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAq3hhlg29NtC1SkQxOGizTpeYgb7rTqGs", // Replace with your API key
    libraries,
  });

  // Handle autocomplete for pickup and dropoff addresses
  const handleAutocomplete = (ref, setAddress, setLocation) => {
    if (!ref.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(ref.current, {
      types: ["address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.error("No details available for input: " + place.name);
        return;
      }

      setAddress(place.formatted_address);
      setLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });
  };

  // Convert latitude and longitude to address using Geocoding API
  const geocodeLatLng = async (lat, lng, setAddress) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        console.error("Geocoding failed:", status);
      }
    });
  };

  // Handle map click to set pickup or dropoff location
  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (!pickupLocation) {
      setPickupLocation({ lat, lng });
      await geocodeLatLng(lat, lng, setPickupAddress);
    } else if (!dropoffLocation) {
      setDropoffLocation({ lat, lng });
      await geocodeLatLng(lat, lng, setDropoffAddress);
    }
  };

  // Clear selected locations from the map
  const clearLocations = () => {
    setPickupLocation(null);
    setDropoffLocation(null);
    setPickupAddress("");
    setDropoffAddress("");
  };

  // Clear all form fields
  const clearForm = () => {
    setPickupAddress("");
    setDropoffAddress("");
    setRoute("");
    setDepartureDate("");
    setDepartureTime("");
    setSeats(1);
    setPrice(0);
    setComment("");
    setPickupLocation(null);
    setDropoffLocation(null);
    setValidationError("");
  };

  // Validate form inputs
  const validateForm = () => {
    if (!pickupAddress || !dropoffAddress) {
      setValidationError("Please select pickup and drop-off locations.");
      return false;
    }
    if (!departureDate || !departureTime) {
      setValidationError("Please enter a valid departure date and time.");
      return false;
    }
    if (seats < 1 || seats > 10) {
      setValidationError("Seats must be between 1 and 10.");
      return false;
    }
    if (price < 0) {
      setValidationError("Price cannot be negative.");
      return false;
    }
    setValidationError("");
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const rideData = {
      driverId: currentUser._id,
      pickupAddress,
      dropoffAddress,
      route,
      departureDate,
      departureTime,
      seats,
      price,
      comment,
      pickupLocation,
      dropoffLocation,
    };

    onSubmit(rideData);
    clearForm();
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display validation errors */}
      {validationError && (
        <Alert color="failure" className="mb-6">
          {validationError}
        </Alert>
      )}

      {/* Pickup Address */}
      <div>
        <Label htmlFor="pickupAddress" value="Pickup Address" />
        <TextInput
          id="pickupAddress"
          ref={pickupRef}
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          onFocus={() => handleAutocomplete(pickupRef, setPickupAddress, setPickupLocation)}
          required
          placeholder="Enter pickup address"
        />
      </div>

      {/* Drop-off Address */}
      <div>
        <Label htmlFor="dropoffAddress" value="Drop-off Address" />
        <TextInput
          id="dropoffAddress"
          ref={dropoffRef}
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
          onFocus={() => handleAutocomplete(dropoffRef, setDropoffAddress, setDropoffLocation)}
          required
          placeholder="Enter drop-off address"
        />
      </div>

      {/* Route */}
      <div>
        <Label htmlFor="route" value="Route" />
        <TextInput
          id="route"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          required
          placeholder="Enter route (e.g., Via Highway 101)"
        />
      </div>

      {/* Departure Date */}
      <div>
        <Label htmlFor="departureDate" value="Departure Date" />
        <TextInput
          id="departureDate"
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          required
        />
      </div>

      {/* Departure Time */}
      <div>
        <Label htmlFor="departureTime" value="Departure Time" />
        <TextInput
          id="departureTime"
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          required
        />
      </div>

      {/* Seats Available */}
      <div>
        <Label htmlFor="seats" value="Seats Available" />
        <TextInput
          id="seats"
          type="number"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          min="1"
          required
          placeholder="Enter number of seats"
        />
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="price" value="Price" />
        <TextInput
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder="Enter price per seat"
        />
      </div>

      {/* Comment */}
      <div>
        <Label htmlFor="comment" value="Comment" />
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment (optional)"
        />
      </div>

      {/* Map Component */}
      <div>
        <Label value="Select Pickup and Drop-off Locations" />
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          zoom={13}
          center={pickupLocation || { lat: 36.8065, lng: 10.1815 }} // Default to Tunis
          onClick={handleMapClick}
        >
          {pickupLocation && <Marker position={pickupLocation} />}
          {dropoffLocation && <Marker position={dropoffLocation} />}
        </GoogleMap>
        <Button
          type="button"
          color="light"
          onClick={clearLocations}
          className="mt-2"
        >
          Clear Locations
        </Button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        gradientDuoTone="pinkToOrange"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Publishing..." : "Publish Ride"}
      </Button>
    </form>
  );
};

export default PublishRideForm;