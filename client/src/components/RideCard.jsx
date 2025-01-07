import React, { useState } from "react";
import { Button, Card, Badge, Modal } from "flowbite-react";
import {
  FaCalendarAlt,
  FaClock,
  FaUserFriends,
  FaDollarSign,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";

const RideCard = ({ ride, onEdit, onDelete }) => {
  const [showPassengersModal, setShowPassengersModal] = useState(false);

  return (
    <Card>
      {/* Ride Details */}
      <div className="space-y-3">
        {/* Header: Date and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-50 rounded-full">
              <FaCalendarAlt className="text-blue-600 w-3 h-3" />
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {new Date(ride.departureDate).toLocaleDateString()}
            </span>
          </div>
          <Badge
            color={new Date(ride.departureDate) >= new Date() ? "success" : "failure"}
            className="text-xs"
          >
            {new Date(ride.departureDate) >= new Date() ? "Upcoming" : "Past"}
          </Badge>
        </div>

        {/* Time and Seats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="p-1 bg-purple-50 rounded-full">
              <FaClock className="text-purple-600 w-3 h-3" />
            </div>
            <span className="text-xs text-gray-600">{ride.departureTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="p-1 bg-green-50 rounded-full">
              <FaUserFriends className="text-green-600 w-3 h-3" />
            </div>
            <span className="text-xs text-gray-600">{ride.seats} seats</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1">
          <div className="p-1 bg-yellow-50 rounded-full">
            <FaDollarSign className="text-yellow-600 w-3 h-3" />
          </div>
          <span className="text-xs font-semibold text-gray-700">${ride.price}</span>
        </div>

        {/* Addresses: Pickup and Dropoff */}
        <div className="grid grid-cols-2 gap-3">
          {/* Pickup Address */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="p-1 bg-blue-50 rounded-full">
                <FaMapMarkerAlt className="text-blue-600 w-3 h-3" />
              </div>
              <span className="text-xs font-semibold text-gray-700">Pickup</span>
            </div>
            <p className="text-xs text-gray-600 pl-8">{ride.pickupAddress}</p>
          </div>

          {/* Dropoff Address */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="p-1 bg-red-50 rounded-full">
                <FaMapMarkerAlt className="text-red-600 w-3 h-3" />
              </div>
              <span className="text-xs font-semibold text-gray-700">Dropoff</span>
            </div>
            <p className="text-xs text-gray-600 pl-8">{ride.dropoffAddress}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          color="gray"
          outline
          size="sm"
          className="flex-1 hover:bg-gray-100 transition-colors text-xs flex items-center justify-center gap-1"
          onClick={() => onEdit(ride._id)}
        >
          <FaEdit className="w-3 h-3" /> Edit
        </Button>
        <Button
          gradientMonochrome="failure"
          outline
          size="sm"
          className="flex-1 hover:bg-red-100 transition-colors text-xs flex items-center justify-center gap-1"
          onClick={() => onDelete(ride._id)}
        >
          <FaTrash className="w-3 h-3" /> Delete
        </Button>
        <Button
          gradientDuoTone="pinkToOrange"
          outline
          size="sm"
          className="flex-1 hover:bg-blue-100 transition-colors text-xs flex items-center justify-center gap-1"
          onClick={() => setShowPassengersModal(true)}
        >
          <FaUsers className="w-3 h-3" /> Passengers
        </Button>
      </div>

      {/* Passengers Modal */}
      <Modal show={showPassengersModal} onClose={() => setShowPassengersModal(false)} size="md">
        <Modal.Header>Passengers</Modal.Header>
        <Modal.Body>
          {ride.passengers.length === 0 ? (
            <p className="text-gray-600">No passengers have joined this ride yet.</p>
          ) : (
            <div className="space-y-3">
              {ride.passengers.map((passenger) => (
                <div key={passenger._id} className="flex items-center gap-3">
                  <img
                    src={passenger.profilePicture || "https://via.placeholder.com/40"}
                    alt={passenger.firstName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {passenger.firstName} {passenger.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{passenger.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" outline onClick={() => setShowPassengersModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default RideCard;