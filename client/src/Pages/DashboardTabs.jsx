import { Flowbite, Tabs } from 'flowbite-react'
import React from 'react'
import { HiUserCircle } from "react-icons/hi";
import { MdLockPerson } from "react-icons/md";
import DashProfile from '../components/DashProfile';
import DashAccount from '../components/DashAccount';

const DashboardTabs = () => {
    return (

        <div className="max-w-lg mx-auto p-2 w-full">
            <Tabs aria-label="Full width tabs" variant="fullWidth" >
                <Tabs.Item active title="About You" icon={HiUserCircle}  >
                    <DashProfile />

                </Tabs.Item>
                <Tabs.Item title="Account" icon={MdLockPerson}>
                    <DashAccount />

                </Tabs.Item>


            </Tabs>

        </div>

    )
}

export default DashboardTabs