import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, Badge, Dropdown, Pagination, Spinner } from "flowbite-react";
import { FaCalendarAlt, FaClock, FaUserFriends, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsSearch } from "react-icons/bs";

const SearchRides = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [ridesPerPage] = useState(8);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch("http://localhost:8000/rides/all");
        const data = await res.json();
        if (res.ok) {
          setRides(data);
        } else {
          setError(data.message || "Failed to fetch rides");
        }
      } catch (error) {
        setError("Failed to fetch rides");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handleJoinRide = async (rideId) => {
    if (!currentUser) {
      toast.error("You must be logged in to join a ride");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/rides/join/${rideId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("You have successfully joined the ride!");
        setRides((prevRides) =>
          prevRides.map((ride) =>
            ride._id === rideId
              ? { ...ride, passengers: [...ride.passengers, currentUser._id] }
              : ride
          )
        );
      } else {
        toast.error(data.message || "Failed to join the ride");
      }
    } catch (error) {
      toast.error("Failed to join the ride");
    }
  };

  const handleLeaveRide = async (rideId) => {
    if (!currentUser) {
      toast.error("You must be logged in to leave a ride");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/rides/leave/${rideId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("You have successfully left the ride!");
        setRides((prevRides) =>
          prevRides.map((ride) =>
            ride._id === rideId
              ? {
                  ...ride,
                  passengers: ride.passengers.filter(
                    (passenger) => passenger.toString() !== currentUser._id
                  ),
                }
              : ride
          )
        );
      } else {
        toast.error(data.message || "Failed to leave the ride");
      }
    } catch (error) {
      toast.error("Failed to leave the ride");
    }
  };

  const filteredRides = rides.filter((ride) => {
    const rideDate = new Date(ride.departureDate);
    const today = new Date();
    if (filter === "upcoming") {
      return rideDate >= today;
    } else if (filter === "past") {
      return rideDate < today;
    }
    return true;
  });

  const searchedRides = filteredRides.filter((ride) =>
    ride.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ride.dropoffAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRides = searchedRides.sort((a, b) => {
    if (sort === "date") {
      return new Date(a.departureDate) - new Date(b.departureDate);
    } else if (sort === "price") {
      return a.price - b.price;
    }
    return 0;
  });

  // Pagination Logic
  const indexOfLastRide = currentPage * ridesPerPage;
  const indexOfFirstRide = indexOfLastRide - ridesPerPage;
  const currentRides = sortedRides.slice(indexOfFirstRide, indexOfLastRide);

  if (loading) {
    return (
      <div className="text-center py-8">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BsSearch /> Search Rides
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by pickup or dropoff address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Dropdown label={<><FaCalendarAlt className="mr-2" /> Filter</>} arrowIcon={false}>
          <Dropdown.Item onClick={() => setFilter("all")}>All Rides</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("upcoming")}>Upcoming Rides</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("past")}>Past Rides</Dropdown.Item>
        </Dropdown>

        <Dropdown label={<><FaClock className="mr-2" /> Sort By</>} arrowIcon={false}>
          <Dropdown.Item onClick={() => setSort("date")}>Date</Dropdown.Item>
          <Dropdown.Item onClick={() => setSort("price")}>Price</Dropdown.Item>
        </Dropdown>
      </div>

      {/* Rides Grid */}
      {currentRides.length === 0 ? (
        <p className="text-gray-600">No rides found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentRides.map((ride) => (
              <Card key={ride._id} className="shadow-sm">
                <div className="space-y-3">
                  {/* Ride Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" />
                      <span className="text-xs font-semibold">
                        {new Date(ride.departureDate).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge color={new Date(ride.departureDate) >= new Date() ? "success" : "failure"}>
                      {new Date(ride.departureDate) >= new Date() ? "Upcoming" : "Past"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaClock className="text-purple-600" />
                    <span className="text-xs">{ride.departureTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaUserFriends className="text-green-600" />
                    <span className="text-xs">{ride.seats - ride.passengers.length} seats available</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaDollarSign className="text-yellow-600" />
                    <span className="text-xs font-semibold">${ride.price}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span className="text-xs font-semibold">Pickup: {ride.pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-600" />
                      <span className="text-xs font-semibold">Dropoff: {ride.dropoffAddress}</span>
                    </div>
                  </div>
                <br />
                  {/* Join/Leave Ride Button */}
                  {currentUser ? (
                    ride.passengers.includes(currentUser._id) ? (
                      <Button
                        gradientDuoTone="failure"
                        size="sm"
                        onClick={() => handleLeaveRide(ride._id)}
                      >
                        Leave Ride
                      </Button>
                    ) : (
                      <Button
                        gradientDuoTone="pinkToOrange"
                        size="sm"
                        onClick={() => handleJoinRide(ride._id)}
                        disabled={ride.passengers.length >= ride.seats}
                      >
                        Join Ride
                      </Button>
                    )
                  ) : (
                    <Button
                      gradientDuoTone="pinkToOrange"
                      size="sm"
                      onClick={() => toast.error("You must be logged in to join a ride")}
                      disabled={ride.passengers.length >= ride.seats}
                    >
                      Join Ride
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(sortedRides.length / ridesPerPage)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SearchRides;