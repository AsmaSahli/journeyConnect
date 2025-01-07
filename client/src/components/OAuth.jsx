import React from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const auth = getAuth(app); // Initialize Firebase auth
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const { displayName, email, photoURL } = resultsFromGoogle.user;

            // Prepare the name and ensure proper splitting
            const name = displayName || 'Unknown User';

            // Send the data to the backend
            const res = await fetch('http://localhost:8000/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    googlePhotoUrl: photoURL,
                    dateOfBirth: null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            } else {
                console.error('Error from backend:', data);
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
        }
    };


    return (
        <Button
            type="button"
            gradientDuoTone="redToYellow"
            size="xs"
            outline
            onClick={handleGoogleClick}
        >
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            Continue with Google
        </Button>
    );
};

export default OAuth;
