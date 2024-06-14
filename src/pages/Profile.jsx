import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Profile() {
    const [profile, setProfile] = useState({});
    const [showLogoutMessage, setShowLogoutMessage] = useState(false); // State for controlling the logout message

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/profile', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            setProfile(res.data.data);
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda belum login'));
            }
        });
    }, [navigate]);

    const handleLogout = (event) => {
        event.preventDefault();

        // Confirm logout intent
        if (window.confirm("Apakah anda yakin ingin logout?")) {
            axios.get('http://localhost:8000/logout', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
            .then(res => {
                localStorage.removeItem('access_token');
                setShowLogoutMessage(true); // Set the logout message to true
                setTimeout(() => { // Timeout to delay navigation
                    setShowLogoutMessage(false);
                    navigate('/login');
                }, 2000); // Delay 2 seconds before navigating
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    return (
        <>
        <Navbar/>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="block w-full max-w-sm bg-dark border border-gray-200 rounded-lg shadow ">
                <div className="flex flex-col items-center pb-10 pt-10">
                    <img 
                        src={profile.photoUrl || "kucing.jpg"} 
                        alt="Profile" 
                        className="w-24 h-24 mb-3 rounded-full shadow-lg"
                    />
                    <h5 className="mb-1 text-xl font-medium text-white-900">
                        {profile.username}
                    </h5>
                    <span className="text-sm text-gray-500">
                        {profile.email}
                    </span>
                    <div className="flex mt-4 md:mt-6">
                        <Link to="/dashboard" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Dashboard
                        </Link>
                        <a href="#" onClick={handleLogout} className="py-2 px-4 ms-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800">
                            Logout
                        </a>
                    </div>
                    {showLogoutMessage && (
                        <p className="text-lg font-semibold mt-4 text-Black-600">Anda sudah logout!</p>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}
