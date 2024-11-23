import React from 'react'
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashSidebar from '../components/DashSidebar';
import DashUsers from '../components/DashUsers';





    const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const [testId, setTestId] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        const idFromUrl = urlParams.get('id');
        if (tabFromUrl) {
        setTab(tabFromUrl);
        }
        if (idFromUrl) {
        setTestId(idFromUrl);
        }
    }, [location.search]);

return (
    <div className='min-h-screen flex flex-col md:flex-row'>
        <div className='md:w-59'>
        {/* Sidebar */}
        <DashSidebar/>
        </div>
        {/* users */}
        {tab === 'users' && <DashUsers/>}

    </div>
    )
}

export default Dashboard