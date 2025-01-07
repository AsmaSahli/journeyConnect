import React, { useEffect, useState } from 'react';
import { Sidebar } from 'flowbite-react';
import { HiUser, HiOutlineUserGroup, HiChartPie, HiLogout } from 'react-icons/hi';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const DashSidebar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('');
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        setActiveTab(tabFromUrl || 'dash');
    }, [location.search]);

    const handleSignout = async () => {
        try {
            const res = await fetch('http://localhost:8000/signout', { method: 'POST' });
            if (res.ok) {
                dispatch(signoutSuccess());
            } else {
                console.error('Error signing out');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="h-screen">
            <Sidebar aria-label="Dashboard Sidebar" className="h-full" >
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        {/* Dashboard */}
                        <Link to="/dashboard?tab=dash">
                            <Sidebar.Item
                                active={activeTab === 'dash'}
                                icon={HiChartPie}
                                className="hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Dashboard
                            </Sidebar.Item>
                        </Link>

                        {/* Profile */}
                        <Link to="/dashboard?tab=profile">
                            <Sidebar.Item
                                active={activeTab === 'profile'}
                                icon={HiUser}
                                className="hover:bg-gray-200 dark:hover:bg-gray-700"
                                label={currentUser.isAdmin ? 'Admin' : 'User'}
                                labelColor='dark'
                                as='div'
                            >
                                Profile
                            </Sidebar.Item>
                        </Link>

                        {/* Users (Admin Only) */}
                        {currentUser?.isAdmin && (
                            <Link to="/dashboard?tab=users">
                                <Sidebar.Item
                                    active={activeTab === 'users'}
                                    icon={HiOutlineUserGroup}
                                    className="hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    Users
                                </Sidebar.Item>
                            </Link>
                        )}
                        <hr className="my-4 border-gray-200 dark:border-gray-700" />

                        {/* Sign Out */}
                        <div className="mt-auto">
                            <Sidebar.Item
                                icon={HiLogout}
                                onClick={handleSignout}
                                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Sign Out
                            </Sidebar.Item>
                        </div>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>
    );
};

export default DashSidebar;
