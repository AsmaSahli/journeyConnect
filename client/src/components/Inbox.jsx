import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Avatar, Badge } from "flowbite-react";
import { Link } from "react-router-dom";

const Inbox = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await fetch(`http://localhost:8000/messages/inbox/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching inbox:", error);
      }
    };

    fetchInbox();
  }, [currentUser]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg._id}>
              <div className="flex items-center gap-4">
                <Avatar img={msg.senderId.profilePicture} rounded />
                <div>
                  <p className="font-semibold">
                    {msg.senderId.firstName} {msg.senderId.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{msg.message}</p>
                  {msg.rideId && (
                    <Link
                      to={`/ride/${msg.rideId._id}`}
                      className="text-blue-500 text-sm"
                    >
                      View Ride
                    </Link>
                  )}
                </div>
                {!msg.read && <Badge color="red">New</Badge>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;