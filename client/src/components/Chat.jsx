// components/Chat.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Textarea, Modal } from "flowbite-react";
import { FaPaperPlane } from "react-icons/fa";

const Chat = ({ rideId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages for the current ride and user
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Ensure rideId and currentUser._id are valid
        if (!rideId || !currentUser?._id) {
          console.error("Invalid rideId or userId");
          return;
        }
  
        // Debugging: Log rideId and userId
        console.log("Fetching messages for rideId:", rideId);
        console.log("Fetching messages for userId:", currentUser._id);
  
        const res = await fetch(`http://localhost:8000/messages/${rideId}/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    fetchMessages();
  }, [rideId, currentUser]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      let receiverId;

      // If there are previous messages, determine the receiverId from the last message
      if (messages.length > 0) {
        receiverId =
          messages[0].senderId._id === currentUser._id
            ? messages[0].receiverId._id
            : messages[0].senderId._id;
      } else {
        // If no messages exist, fetch the ride details to get the driver's ID
        const rideRes = await fetch(`http://localhost:8000/rides/${rideId}`);
        const rideData = await rideRes.json();

        if (rideRes.ok) {
          // Ensure the ride data contains the driver's ID
          if (rideData.driver && rideData.driver._id) {
            receiverId = rideData.driver._id;
          } else {
            throw new Error("Driver ID not found in ride details");
          }
        } else {
          throw new Error("Failed to fetch ride details");
        }
      }

      // Log the data being sent
      console.log("Sending message with data:", {
        rideId,
        senderId: currentUser._id,
        receiverId,
        message: newMessage,
      });

      // Send the message to the backend
      const res = await fetch("http://localhost:8000/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rideId,
          senderId: currentUser._id,
          receiverId,
          message: newMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...messages, data]); // Add the new message to the list
        setNewMessage(""); // Clear the input field
      } else {
        console.error("Failed to send message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Modal.Body>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.senderId._id === currentUser._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 rounded-lg ${
                msg.senderId._id === currentUser._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onClick={handleSendMessage}>
          <FaPaperPlane />
        </Button>
      </div>
    </Modal.Body>
  );
};

export default Chat;