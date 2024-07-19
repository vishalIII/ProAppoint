import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../utils/axios'; // Assuming axios is imported correctly
import { showLoading, hideLoading } from '../redux/alertSlice';
import Layout from '../components/Layout';
import Spinner from './Spinner'; // Ensure Spinner component is imported
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [userData, setUserData] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.alerts.loading);
    const navigate = useNavigate();

    const getData = async () => {
        try {
            dispatch(showLoading());
            const token = localStorage.getItem('token');

            if (!token) {
                setAlertMessage('No token found, please login');
                setAlertType('error');
                dispatch(hideLoading());
                return;
            }

            const response = await axios.post(
                '/api/user/get-all-approved-doctors',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setUserData(response.data.data);
                setAlertMessage('');
                setAlertType('');
            } else {
                setAlertMessage(response.data.message || 'Failed to fetch approved Professionals');
                setAlertType('error');
            }
        } catch (error) {
            console.error('Error fetching approved Professionals:', error);
            setAlertMessage('Network error. Please try again.');
            setAlertType('error');
        } finally {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleBookAppointment = (doctor) => {
        navigate(`/Professionals/${doctor._id}`, { state: { doctor } });
    };

    return (
        <Layout>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <h1 className="text-4xl font-semibold text-gray-800 mb-4 text-center">Services</h1>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {userData.map((doctor) => (
                            <div
                                key={doctor._id}
                                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 text-xl font-bold">
                                        {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-xl font-semibold">{doctor.firstName} {doctor.lastName}</h2>
                                        <p className="text-gray-500">Service: {doctor.specialization}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-2">Timings: {doctor.timings[0].fromTime} - {doctor.timings[0].toTime}</p>
                                {/* Add more fields as needed */}
                                <button
                                    onClick={() => handleBookAppointment(doctor)}
                                    className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        ))}
                    </div>
                    {alertMessage && (
                        <div className={`mt-4 p-4 bg-red-500 text-white rounded`}>
                            {alertMessage}
                        </div>
                    )}
                </>
            )}
        </Layout>
    );
};

export default Home;
