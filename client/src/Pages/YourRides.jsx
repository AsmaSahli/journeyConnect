import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Alert, Dropdown, Modal, Pagination } from "flowbite-react";
import { FaRoute, FaFilter, FaSort, FaComments } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RideCard from "../components/RideCard";
import Chat from "../components/Chat";

const YourRides = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rideToDelete, setRideToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ridesPerPage] = useState(8);
  const [selectedRideId, setSelectedRideId] = useState(null); // For chat modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch(`http://localhost:8000/rides/user/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setRides(data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch rides");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchRides();
    }
  }, [currentUser]);

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

  const sortedRides = filteredRides.sort((a, b) => {
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

  const handleDeleteRide = async () => {
    try {
      const res = await fetch(`http://localhost:8000/rides/delete/${rideToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setRides(rides.filter((ride) => ride._id !== rideToDelete));
        toast.success("Ride deleted successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete ride");
    } finally {
      setShowDeleteModal(false);
      setRideToDelete(null);
    }
  };

  const handleEditRide = (rideId) => {
    navigate(`/edit-ride/${rideId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <Alert color="failure" className="mx-4 my-8">{error}</Alert>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaRoute /> Your Rides
      </h1>

      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Dropdown label={<><FaFilter className="mr-2" /> Filter</>} arrowIcon={false}>
          <Dropdown.Item onClick={() => setFilter("all")}>All Rides</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("upcoming")}>Upcoming Rides</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("past")}>Past Rides</Dropdown.Item>
        </Dropdown>

        <Dropdown label={<><FaSort className="mr-2" /> Sort By</>} arrowIcon={false}>
          <Dropdown.Item onClick={() => setSort("date")}>Date</Dropdown.Item>
          <Dropdown.Item onClick={() => setSort("price")}>Price</Dropdown.Item>
        </Dropdown>
      </div>

      {/* Rides Grid */}
      {currentRides.length === 0 ? (
        <p className="text-gray-600">You haven't published any rides yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentRides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                onEdit={handleEditRide}
                onDelete={(rideId) => {
                  setRideToDelete(rideId);
                  setShowDeleteModal(true);
                }}
              />
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md">
        <Modal.Header>Delete Ride</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this ride?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleDeleteRide}>
            Delete
          </Button>
          <Button color="gray" outline onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Chat Modal */}
      {selectedRideId && (
        <Modal show={true} onClose={() => setSelectedRideId(null)} size="xl">
          <Modal.Header>Chat</Modal.Header>
          <Modal.Body>
            <Chat rideId={selectedRideId} />
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setSelectedRideId(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default YourRides;