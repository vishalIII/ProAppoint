import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertSlice';
import Layout from '../../components/Layout';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDoctorInfoAndAppointments = async () => {
            try {
                dispatch(showLoading());
                const doctorInfoResponse = await axios.post('/api/doctor/get-doctor-info-by-user-id', {
                    userId: user._id
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (doctorInfoResponse.data.success) {
                    const doctorId = doctorInfoResponse.data.data._id;
                    const appointmentsResponse = await axios.get(`/api/appointment/doctor/appointments/${doctorId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (appointmentsResponse.data.success) {
                        setAppointments(appointmentsResponse.data.data);
                    } else {
                        setAppointments([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                dispatch(hideLoading());
            }
        };

        if (user) {
            fetchDoctorInfoAndAppointments();
        }
    }, [user, dispatch]);

    const handleAppointmentAction = async (appointmentId, action) => {
        try {
            dispatch(showLoading());
            const response = await axios.post(`/api/appointment/${action}`, { appointmentId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appointment) =>
                        appointment._id === appointmentId ? { ...appointment, status: action === 'accept' ? 'approved' : 'rejected' } : appointment
                    )
                );
            }
        } catch (error) {
            console.error(`Error ${action === 'accept' ? 'accepting' : 'rejecting'} appointment:`, error);
        } finally {
            dispatch(hideLoading());
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Professional Appointments</h1>
            {appointments.length === 0 ? (
                <p className="text-gray-600">No appointments found.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {appointments.map((appointment) => (
                        <div key={appointment._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-lg font-semibold mb-2">Name: {appointment.userInfo.name} </h2>
                            <p className="text-gray-600 mb-1"><strong>user Email:</strong> {appointment.userInfo.email}</p>
                            <p className="text-gray-600 mb-1"><strong>Date:</strong> {appointment.date}</p>
                            <p className="text-gray-600 mb-1"><strong>Time:</strong> {appointment.time}</p>
                            <p className={`mb-2 ${appointment.status === 'approved' ? 'text-green-600' : appointment.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}><strong>Status:</strong> {appointment.status}</p>
                            {appointment.status === 'pending' && (
                                <div className="flex space-x-4">
                                    <button 
                                        onClick={() => handleAppointmentAction(appointment._id, 'accept')}
                                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
                                    >
                                        Accept
                                    </button>
                                    <button 
                                        onClick={() => handleAppointmentAction(appointment._id, 'reject')}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default DoctorAppointments;
