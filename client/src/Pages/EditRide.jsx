import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextInput, Label, Textarea, Alert } from "flowbite-react";
import { FaSave, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditRide = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState({
    pickupAddress: "",
    dropoffAddress: "",
    departureDate: "",
    departureTime: "",
    seats: 1,
    price: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch ride details
  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`http://localhost:8000/rides/${rideId}`);
        const data = await res.json();
        if (res.ok) {
          setRide(data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch ride details");
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setRide((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/rides/update/${rideId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ride),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Ride updated successfully!");
        navigate("/your-rides");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update ride");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <Alert color="failure" className="mx-4 my-8">{error}</Alert>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6">Edit Ride</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pickup Address */}
        <div>
          <Label htmlFor="pickupAddress" value="Pickup Address" />
          <TextInput
            id="pickupAddress"
            value={ride.pickupAddress}
            onChange={handleChange}
            required
          />
        </div>

        {/* Dropoff Address */}
        <div>
          <Label htmlFor="dropoffAddress" value="Dropoff Address" />
          <TextInput
            id="dropoffAddress"
            value={ride.dropoffAddress}
            onChange={handleChange}
            required
          />
        </div>

        {/* Departure Date */}
        <div>
          <Label htmlFor="departureDate" value="Departure Date" />
          <TextInput
            id="departureDate"
            type="date"
            value={ride.departureDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Departure Time */}
        <div>
          <Label htmlFor="departureTime" value="Departure Time" />
          <TextInput
            id="departureTime"
            type="time"
            value={ride.departureTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* Seats */}
        <div>
          <Label htmlFor="seats" value="Seats Available" />
          <TextInput
            id="seats"
            type="number"
            value={ride.seats}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price" value="Price" />
          <TextInput
            id="price"
            type="number"
            value={ride.price}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        {/* Comment */}
        <div>
          <Label htmlFor="comment" value="Comment" />
          <Textarea
            id="comment"
            value={ride.comment}
            onChange={handleChange}
            placeholder="Add a comment (optional)"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button type="submit" gradientDuoTone="pinkToOrange" className="flex-1">
            <FaSave className="mr-2" /> Save Changes
          </Button>
          <Button
            type="button"
            color="gray"
            outline
            className="flex-1"
            onClick={() => navigate("/your-rides")}
          >
            <FaTimes className="mr-2" /> Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditRide;