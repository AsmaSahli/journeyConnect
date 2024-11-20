import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Navbar, Dropdown, Avatar } from 'flowbite-react';
import { signoutSuccess } from '../redux/user/userSlice';

const Header = () => {
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            const res = await fetch('http://localhost:8000/signout', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                dispatch(signoutSuccess());
                navigate('/signin');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Navbar className="border-b shadow-md dark:bg-gray-800 bg-white">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        Journey<span className="font-light">Connect</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center justify-center gap-4 px-4">
                    <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">
                        Home
                    </Link>
                    <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">
                        About
                    </Link>
                </div>

                {/* Theme Toggle & Authentication */}
                <div className="flex items-center gap-4">
                    {currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt={currentUser.username}
                                    img={currentUser.profilePicture}
                                    rounded
                                    className="cursor-pointer"
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className="block text-sm font-medium truncate">
                                    {currentUser.email}
                                </span>
                            </Dropdown.Header>
                            <Dropdown.Item onClick={() => navigate('/dashboard?tab=profile')}>
                                Profile
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to="/signin">
                            <Button gradientDuoTone="pinkToOrange" outline>
                                <FaSignInAlt /> Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </Navbar>
    );
};

export default Header;
