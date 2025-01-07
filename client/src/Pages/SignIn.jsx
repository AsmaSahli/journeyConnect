import { Alert, Button, Label, Spinner, TextInput, Card } from 'flowbite-react';
import { useState } from 'react';
import OAuth from '../components/OAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from '../redux/user/userSlice';
import carpolling2 from '../assets/carpolling2.png';

const SignIn = () => {
    const [formData, setFormData] = useState({});
    const { loading, error: errorMessage } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            return dispatch(signInFailure('Please fill all the fields'));
        }
        try {
            dispatch(signInStart());
            const res = await fetch('http://localhost:8000/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
            }

            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <div className="flex p-5 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-10">

                {/* Left Section */}
                <div className="flex-1 text-center md:text-left space-y-6">
                    <img src={carpolling2} alt="Social Media Graphic" className="mx-auto md:mx-0" />
                    <p className="text-lg font-semibold text-gray-700">
                        Welcome back to <span className="text-blue-600">Journey Connect</span>
                    </p>

                    <p className=" pl-5 text-center text-gray-600">
                        Your Ride Awaits!

                    </p>

                </div>

                {/* Right Section (Form) */}
                <div className="flex-1">
                    <Card className="p-8 shadow-lg rounded-lg border border-gray-200 bg-white">
                        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Sign In to Your Account</h2>
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
                                <Label value="Password" />
                                <TextInput
                                    type="password"
                                    placeholder="Enter your password"
                                    id="password"
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
                                    'Sign In'
                                )}
                            </Button>
                            <br />
                            <OAuth />
                        </form>

                        <div className="flex justify-center gap-2 text-sm mt-5">
                            <span>Don't have an account?</span>
                            <Link to="/signup" className="text-blue-600 font-semibold">
                                Register Now
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

export default SignIn;
