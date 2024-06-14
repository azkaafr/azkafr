import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Inbound() {
    const [payload, setPayload] = useState({
        date: "",
        stuff_id: "",
        total: "",
        proff_file: null
    });

    const [stuff, setStuff] = useState([]);
    const [error, setError] = useState({});
    const [alert, setAlert] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:800/stuffs', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            setStuff(res.data.data);
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda belum login!'));
            }
        });
    }, [navigate]);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setPayload(prevPayload => ({
            ...prevPayload,
            [name]: value
        }));
    }

    function handleInputFileChange(e) {
        const { name, files } = e.target;
        setPayload(prevPayload => ({
            ...prevPayload,
            [name]: files[0]
        }));
    }

    function handleSubmitForm(e) {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
            formData.append(key, payload[key]);
        });

        axios.post('http://localhost:800/inbound-stuffs/store', formData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(res => {
            setError({});
            setAlert(true);
        })
        .catch(err => {
            if (err.response && err.response.data) {
                setError(err.response.data);
            }
        });
    }

    const endpoints = {
        "show" : "http://localhost:800/inbound-stuffs/",
        "delete" : "http://localhost:800/inbound-stuffs/delete/{id}",
    }

    return (
        <>
            <Navbar />
            <div className="bg-blue-100 min-h-screen py-7 px-4">
                <div className="bg-white py-7 px-4 mx-auto border-lg border-gray-300 max-w-2xl lg:py-16 rounded-lg shadow-lg">

                    <h2 className="mb-4 text-xl font-bold text-black">Add a new Inbound Stuff Data</h2>

                    {
                        alert && (
                            <div className="p-4 mb-4 text-green-700 bg-green-50 rounded-lg" role="alert">
                                <span className="font-medium">Success:</span> Check inbound data on <b><Link to="/">this page</Link></b>.
                            </div>
                        )
                    }
                    {Object.keys(error).length > 0 && (
                        <div role="alert">
                            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                Gagal!
                            </div>
                            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700 mb-4">
                                <ul>
                                    {Object.entries(error).map(([key, value]) => (
                                        <li key={key}>{key !== "status" && key !== "message" ? value : ''}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleSubmitForm}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="date" className="block mb-2 text-sm font-medium text-black">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    onChange={handleInputChange}
                                    value={payload.date}
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                />
                            </div>
                            <div>
                                <label htmlFor="stuff" className="block mb-2 text-sm font-medium text-black">Stuff</label>
                                <select
                                    id="stuff"
                                    name="stuff_id"
                                    onChange={handleInputChange}
                                    value={payload.stuff_id}
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                >
                                    <option hidden disabled value="">Select Stuff</option>
                                    {stuff.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="total" className="block mb-2 text-sm font-medium text-black">Total Stuff</label>
                                <input
                                    type="number"
                                    name="total"
                                    id="total"
                                    onChange={handleInputChange}
                                    value={payload.total}
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="proff_file" className="block mb-2 text-sm font-medium text-black">Proff File</label>
                                <input
                                    type="file"
                                    name="proff_file"
                                    id="proff_file"
                                    onChange={handleInputFileChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                        >     Add Inbound
                        </button>
                        <Link to={'/inbound-stuff/show'} className="ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-red-800">Show</Link>

                    </form>
                </div>
            </div>
        </>
    );
}