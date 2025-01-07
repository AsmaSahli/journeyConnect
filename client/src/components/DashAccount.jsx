import React, { useState } from 'react'
import { Button, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
} from '../redux/user/userSlice';

const DashAccount = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    const { currentUser, loading } = useSelector((state) => state.user);

    const handleSignout = async () => {
        try {
            const res = await fetch('http://localhost:8000/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    const handlePhoneNumberChange = (e) => {

        const value = e.target.value;
        if (value.startsWith('+216') || value === '') {
            setPhoneNumber(value);
        }
    };
    const handleSubmit = async (e) => { }
    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Account Settings</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <TextInput type="text" value={`Email: ${currentUser.email}`} disabled color="Gray" />
                <TextInput
                    type='password'
                    id='password'
                    placeholder='password'
                    onChange={handleChange}
                />
                <TextInput
                    type='text'
                    id='phoneNumber'
                    onChange={handlePhoneNumberChange}
                    placeholder='Phone Number (+216)'
                    maxLength={13}
                />
                <Button
                    type='submit'
                    gradientDuoTone="pinkToOrange" outline


                >
                    {loading ? 'Loading...' : 'Update'}
                </Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>
                    Delete Account
                </span>
                <span onClick={handleSignout} className='cursor-pointer'>
                    Sign Out
                </span>
            </div>
        </div>
    );
};

export default DashAccount;
