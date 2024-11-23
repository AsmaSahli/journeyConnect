import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Navbar, Dropdown, Avatar } from 'flowbite-react';
import { signoutSuccess } from '../redux/user/userSlice';
import { HiLogout } from "react-icons/hi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaRoute } from "react-icons/fa";

import logo1 from '../assets/logo1.png';
import { GrAddCircle } from "react-icons/gr";
import { BsSearch } from "react-icons/bs";
import { HiChartPie} from 'react-icons/hi';

const Header = () => {
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
                {/* Logo1 Section */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo1} alt="logo1" style={{ height: '65px', width: 'auto' }} />
                </Link>

                {/* Theme Toggle & Authentication */}
                <div className="flex items-center gap-4">
                    {currentUser ? (
                        <>
                            {/* Conditionally render buttons for non-admin users */}
                            {!currentUser.isAdmin && (
                                <div className="flex items-center justify-center gap-4 px-6">
                                    <Link to="/search-car-sharing" className="flex items-center gap-2">
                                        <Button color="light">
                                            <BsSearch className="mr-3 h-4 w-4" />
                                            Search
                                        </Button>
                                    </Link>
                                    <Link to="/offerASeat" className="flex items-center gap-2">
                                        <Button color="light">
                                            <GrAddCircle className="mr-3 h-4 w-4" />
                                            Publish a Ride
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {/* Dropdown Menu */}
                            <Dropdown
                                arrowIcon={true}
                                inline
                                size="lg"
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
                                {/* Admin-specific dropdown items */}
                                {currentUser.isAdmin ? (
                                    <>
                                        <Dropdown.Item
                                            icon={HiChartPie}
                                            onClick={() => navigate('/dashboard')}
                                        >
                                            Dashboard
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            icon={CgProfile}
                                            onClick={() => navigate('/Profile')}
                                        >
                                            Profile
                                        </Dropdown.Item>
                                    </>
                                ) : (
                                    <>
                                        <Dropdown.Item icon={FaRoute}>
                                            Your rides
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            icon={IoChatbubbleEllipsesOutline}
                                            onClick={() => navigate('/messages')}
                                        >
                                            Inbox
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            icon={CgProfile}
                                            onClick={() => navigate('/Profile')}
                                        >
                                            Profile
                                        </Dropdown.Item>
                                    </>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item icon={HiLogout} onClick={handleSignout}>
                                    Sign Out
                                </Dropdown.Item>
                            </Dropdown>
                        </>
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
