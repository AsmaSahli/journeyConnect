import React from 'react';
import logo1 from '../assets/logo1.png';
const Messages = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-3xl w-full">
                {/* Logo Section */}
                <img 
                    src={logo1} 
                    alt="App Logo" 
                    className="mx-auto mb-8 w-24 h-24 object-cover" 
                />
                <h1 className="text-lg font-semibold">Inbox</h1>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                    No messages right now. Book or publish a ride to contact other members. If you have already an upcoming ride, feel free to contact who you're travelling with!
                </p>

            </div>
        </div>
    );
};

export default Messages;
