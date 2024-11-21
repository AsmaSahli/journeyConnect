import React, { useState } from 'react';
import { Alert, Button, Label, Spinner, TextInput, Card } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import carpooling1 from '../assets/carpooling1.png';
import OAuth from '../components/OAuth';

const SignUp = () => {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.dateOfBirth) {
            return setErrorMessage('Please fill out all fields.');
        }

        if (formData.password.length < 6) {
            return setErrorMessage('Password must be at least 6 characters.');
        }

        if (formData.password !== formData.confirmPassword) {
            return setErrorMessage('Password and Confirm Password must match.');
        }

        try {
            setLoading(true);
            setErrorMessage(null);

            const res = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Sign up failed');
            }

            const data = await res.json();

            if (data.success === false) {
                return setErrorMessage(data.message);
            }

            setLoading(false);
            if (res.status === 200) {
                navigate('/signin');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Email is already in use. Please use a different email.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <div className="flex p-5 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-10">
                
                {/* Left Section */}
                <div className="flex-1 text-center md:text-left space-y-6">
                    <img src={carpooling1} alt="Social Media" />
                    <p className="text-lg font-semibold text-gray-700">
                        Welcome to <span className="text-blue-600">Journey Connect</span> 
                    </p>
                    
                    <p  className="text-sm  text-gray-700">your carpooling journey starts here!</p>
                    <br />
                    <ul className="list-disc pl-5 text-left text-gray-600">
                        <li>🚗 Reconnect with your community of riders and drivers</li>
                        <li>🤝 Share journeys and make connections on the go</li>
                        <li>⏰ Never miss a ride – real-time updates at your fingertips</li>
                    </ul>
                    <Button size="xs" gradientDuoTone="pinkToOrange" className="mt-3">
                        Learn More
                    </Button>
                </div>

                {/* Right Section (Form) */}
                <div className="flex-1">
                    <Card className="p-8 shadow-lg rounded-lg border border-gray-200 bg-white">
                        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Create Your Account</h2>
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div>
                                <Label value="First Name" />
                                <TextInput
                                    type="text"
                                    placeholder="Enter your first name"
                                    id="firstName"
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label value="Last Name" />
                                <TextInput
                                    type="text"
                                    placeholder="Enter your last name"
                                    id="lastName"
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label value="Email" />
                                <TextInput
                                    type="email"
                                    placeholder="Enter your email"
                                    id="email"
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label value="Date of Birth" />
                            </div>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    onChange={handleChange}
                                    max="2024-12-31" // Prevent selecting a date before 2024
                                    style={{ backgroundColor: '#F9FAFB', borderRadius: '6px', border: '1px solid #D1D5DB'}}
                                />

                            <div>
                                <Label value="Password" />
                                <TextInput
                                    type="password"
                                    placeholder="Enter your password"
                                    id="password"
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label value="Confirm Password" />
                                <TextInput
                                    type="password"
                                    placeholder="Confirm your password"
                                    id="confirmPassword"
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <Button
                                gradientDuoTone="pinkToOrange"
                                type="submit"
                                disabled={loading}
                                className="mt-3"
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" />
                                        <span className="pl-3">Loading...</span>
                                    </>
                                ) : (
                                    'Join Journey Connect'
                                )}
                            </Button>
                            <br/>
                            <OAuth/>
                        </form>

                        <div className="flex justify-center gap-2 text-sm mt-5">
                            <span>Already have an account?</span>
                            <Link to="/signin" className="text-blue-600 font-semibold">
                                Sign In
                            </Link>
                        </div>
                        {errorMessage && (
                            <Alert className="mt-5" color="failure">
                                {errorMessage}
                            </Alert>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
