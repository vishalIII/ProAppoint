import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertSlice';
import Spinner from '../pages/Spinner'; // Ensure Spinner component is imported

const UserAppointments = () => {
    const dispatch = useDispatch();
    const [appointments, setAppointments] = useState([]);
    const loading = useSelector((state) => state.alerts.loading);

    useEffect(() => {
        const fetchUserAppointments = async () => {
            try {
                dispatch(showLoading());
                const response = await axios.get('/api/appointment/user/appointments', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.data.success) {
                    setAppointments(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching user appointments:', error);
            } finally {
                dispatch(hideLoading());
            }
        };

        fetchUserAppointments();
    }, [dispatch]);

    return (
        <Layout>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">My Appointments</h1>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {appointments.length === 0 ? (
                        <p className="text-gray-600">No appointments found</p>
                    ) : (
                        <div className="overflow-x-auto rounded-md ml-20 mr-20">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="border-b bg-gray-200">
                                        <th className="py-2 px-4 text-left">Service Provider</th>
                                        <th className="py-2 px-4 text-left">Specialization</th>
                                        <th className="py-2 px-4 text-left">Date</th>
                                        <th className="py-2 px-4 text-left">Time</th>
                                        <th className="py-2 px-4 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment._id} className="border-b rounded">
                                            <td className="py-2 px-4">{appointment.doctorInfo.firstName} {appointment.doctorInfo.lastName}</td>
                                            <td className="py-2 px-4">{appointment.doctorInfo.specialization}</td>
                                            <td className="py-2 px-4">{appointment.date}</td>
                                            <td className="py-2 px-4">{appointment.time}</td>
                                            <td className={`py-2 px-4 ${appointment.status === 'approved' ? 'text-green-600' : appointment.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                                {appointment.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </Layout>
    );
};

export default UserAppointments;
